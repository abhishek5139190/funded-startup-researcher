import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Company, HiringConfidence } from '../types';
import { db } from '../db';
import { logger } from '../utils/logger';

const HIRING_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

export function heuristicScore(company: Company): HiringConfidence {
  let score = 30;
  const positive: string[] = [];
  const negative: string[] = [];

  const daysSinceFunding = daysSince(company.latest_funding_round.date);
  if (daysSinceFunding < 90) {
    score += 25;
    positive.push('Funded (High impact)');
  }
  if (company.latest_funding_round.amount > 10_000_000) {
    score += 20;
    positive.push('Funding amount exceeds $10M');
  }
  const hiringKeywordHit = company.recent_news.some((n) =>
    /hiring|growth|expanding|expansion/i.test(`${n.title} ${n.snippet}`),
  );
  if (hiringKeywordHit) {
    score += 20;
    positive.push('Keywords: "hiring"/"expanding" in recent news');
  }
  if (company.job_postings.length > 0) {
    score += 15;
    positive.push(`${company.job_postings.length} active job posting(s)`);
  }
  if (company.team_size > 50) {
    score += 15;
    positive.push('Team expansion (established headcount)');
  }
  const layoffHit = company.recent_news.some((n) => /layoff|restructur/i.test(`${n.title} ${n.snippet}`));
  if (layoffHit) {
    score -= 25;
    negative.push('Recent layoff/restructuring news');
  }
  if (daysSince(company.updated_at) > 30) {
    score -= 10;
    negative.push('No recent activity in 30 days');
  }
  if (company.job_postings.length === 0) {
    negative.push('No active job postings detected');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    percent: score,
    updated_at: new Date().toISOString(),
    reasoning: `Heuristic score based on funding recency, amount, and hiring signals.`.slice(0, 200),
    signals: { positive, negative },
  };
}

async function geminiScore(company: Company, apiKey: string): Promise<HiringConfidence> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `Analyze the following startup data and estimate the probability they will hire software engineers in the next 3 months.
Return ONLY a JSON object, no markdown, no explanation:

{
  "hiring_confidence_percent": <0-100>,
  "reasoning": "<200 chars explaining key factors>",
  "signals": {
    "positive": ["signal1", "signal2"],
    "negative": ["concern1"]
  }
}

Company Data: ${JSON.stringify({
    name: company.name,
    funding_amount: company.latest_funding_round.amount,
    funding_date: company.latest_funding_round.date,
    stage: company.latest_funding_round.stage,
    team_size: company.team_size,
    industry: company.industry,
    recent_news: company.recent_news.map((n) => n.title),
    job_postings: company.job_postings.map((j) => j.title),
  })}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonText = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  const parsed = JSON.parse(jsonText);

  return {
    percent: Math.max(0, Math.min(100, Number(parsed.hiring_confidence_percent))),
    updated_at: new Date().toISOString(),
    reasoning: String(parsed.reasoning ?? '').slice(0, 200),
    signals: {
      positive: Array.isArray(parsed.signals?.positive) ? parsed.signals.positive : [],
      negative: Array.isArray(parsed.signals?.negative) ? parsed.signals.negative : [],
    },
  };
}

function getCached(companyId: string): HiringConfidence | null {
  const row = db
    .prepare('SELECT data_json, cached_at FROM hiring_cache WHERE company_id = ?')
    .get(companyId) as { data_json: string; cached_at: string } | undefined;
  if (!row) return null;
  if (Date.now() - new Date(row.cached_at).getTime() > HIRING_CACHE_TTL_MS) return null;
  return JSON.parse(row.data_json);
}

function saveCache(companyId: string, data: HiringConfidence): void {
  db.prepare(
    `INSERT INTO hiring_cache (company_id, data_json, cached_at) VALUES (?, ?, ?)
     ON CONFLICT(company_id) DO UPDATE SET data_json = excluded.data_json, cached_at = excluded.cached_at`,
  ).run(companyId, JSON.stringify(data), new Date().toISOString());
}

export async function predictHiringConfidence(company: Company): Promise<HiringConfidence> {
  const cached = getCached(company.id);
  if (cached) return cached;

  const apiKey = process.env.GEMINI_API_KEY;
  let result: HiringConfidence;

  if (apiKey) {
    try {
      result = await geminiScore(company, apiKey);
    } catch (err) {
      logger.error(`Gemini scoring failed for ${company.name}, falling back to heuristic`, err);
      result = heuristicScore(company);
    }
  } else {
    result = heuristicScore(company);
  }

  saveCache(company.id, result);
  return result;
}
