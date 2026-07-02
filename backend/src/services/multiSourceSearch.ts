import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Company, SearchFilters } from '../types';
import { logo } from '../data/seedCompanies';
import { logger } from '../utils/logger';

// Funding-relevant sources with public/searchable article indexes. Deliberately excludes
// paid structured-data providers (Crunchbase/PitchBook/Dealroom/Tracxn APIs) and editorial-only
// VC blogs/newsletters, which don't yield reliable "Company X raised $Y" extraction at scale.
const SOURCE_DOMAINS = [
  'techcrunch.com',
  'news.crunchbase.com',
  'sifted.eu',
  'venturebeat.com',
  'yourstory.com',
  'inc42.com',
  'producthunt.com',
];

interface SerperNewsItem {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  source?: string;
}

function buildQuery(filters: SearchFilters): string {
  const parts: string[] = [];
  if (filters.company_name?.trim()) parts.push(filters.company_name.trim());
  if (filters.sector.length > 0) parts.push(`(${filters.sector.join(' OR ')})`);
  if (filters.stage.length > 0) parts.push(`(${filters.stage.join(' OR ')})`);
  parts.push('startup funding');

  const siteScope = SOURCE_DOMAINS.map((d) => `site:${d}`).join(' OR ');
  return `${parts.join(' ')} (${siteScope})`;
}

async function fetchMultiSourceNews(filters: SearchFilters): Promise<SerperNewsItem[]> {
  const response = await axios.post(
    'https://google.serper.dev/news',
    { q: buildQuery(filters), num: 20 },
    { headers: { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' }, timeout: 10_000 },
  );
  return response.data?.news ?? [];
}

function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

async function extractCompaniesWithGemini(
  newsItems: SerperNewsItem[],
  apiKey: string,
): Promise<Array<Omit<Company, 'hiring_confidence' | 'logo_url'>>> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are extracting startup funding announcements from news search results.
For each article that describes a company raising a funding round, extract a structured record.
Skip articles that are not about a specific company's funding round.
Return ONLY a JSON array (no markdown), each item shaped exactly like:

{
  "name": "Company Name",
  "tagline": "one-line description",
  "description": "1-2 sentence description",
  "website": "https://example.com or empty string if unknown",
  "amount": <funding amount in USD as a number, 0 if undisclosed>,
  "stage": "Seed" | "Series A" | "Series B" | "Series C+" | "Undisclosed",
  "date": "<ISO date string, use the article date>",
  "investors": ["investor1"],
  "country": "<best-guess country name or empty string>",
  "region": "North America" | "Europe" | "Asia-Pacific" | "Other",
  "city": "<city, region or empty string>",
  "industry": ["sector tag"],
  "team_size": <best-guess integer, 0 if unknown>,
  "source": "<publication name from the article>",
  "url": "<article url>"
}

News articles:
${JSON.stringify(newsItems.slice(0, 20).map((n) => ({ title: n.title, snippet: n.snippet, url: n.link, date: n.date, source: n.source ?? domainFromUrl(n.link) })))}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonText = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed)) return [];

  const now = new Date().toISOString();
  return parsed
    .filter((p) => typeof p?.name === 'string' && p.name.trim().length > 0)
    .map((p) => ({
      id: `live-${Buffer.from(p.name).toString('hex').slice(0, 12)}`,
      name: p.name,
      tagline: String(p.tagline ?? ''),
      website: String(p.website ?? ''),
      description: String(p.description ?? ''),
      latest_funding_round: {
        amount: Number(p.amount) || 0,
        currency: 'USD' as const,
        date: String(p.date ?? now),
        stage: (['Seed', 'Series A', 'Series B', 'Series C+', 'Undisclosed'].includes(p.stage)
          ? p.stage
          : 'Undisclosed') as Company['latest_funding_round']['stage'],
        investors: Array.isArray(p.investors) ? p.investors : [],
      },
      country: String(p.country ?? ''),
      region: String(p.region ?? 'Other'),
      city: String(p.city ?? ''),
      industry: Array.isArray(p.industry) ? p.industry : [],
      team_size: Number(p.team_size) || 0,
      recent_news: [
        {
          title: p.name ? `${p.name} funding update` : 'Funding update',
          snippet: String(p.description ?? ''),
          source: String(p.source ?? 'Web'),
          url: String(p.url ?? ''),
          date: String(p.date ?? now),
        },
      ],
      job_postings: [],
      created_at: now,
      updated_at: now,
      source_urls: [String(p.url ?? '')],
    }));
}

export async function searchMultiSource(
  filters: SearchFilters,
): Promise<Array<Omit<Company, 'hiring_confidence'>> | null> {
  if (!process.env.SERPER_API_KEY) return null;

  try {
    const newsItems = await fetchMultiSourceNews(filters);
    if (newsItems.length === 0) return [];

    if (!process.env.GEMINI_API_KEY) {
      logger.warn('SERPER_API_KEY set but GEMINI_API_KEY missing — cannot extract structured data from live news');
      return null;
    }

    const extracted = await extractCompaniesWithGemini(newsItems, process.env.GEMINI_API_KEY);
    return extracted.map((c) => ({ ...c, logo_url: logo(c.name) }));
  } catch (err) {
    logger.error('Multi-source live search failed, falling back to seed data', err);
    return null;
  }
}
