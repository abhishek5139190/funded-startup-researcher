import type { Company } from '../types';

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const PALETTE = ['#6366f1', '#059669', '#d97706', '#dc2626', '#2563eb', '#7c3aed', '#0891b2', '#db2777'];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

export function logo(seed: string): string {
  const color = PALETTE[hashSeed(seed) % PALETTE.length];
  const initials = seed
    .split(/(?=[A-Z])/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="14" fill="${color}"/><text x="32" y="40" font-family="system-ui" font-size="24" font-weight="600" fill="white" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export interface SeedCompany extends Omit<Company, 'hiring_confidence' | 'logo_url'> {}

export const SEED_COMPANIES: SeedCompany[] = [
  {
    id: 'c1',
    name: 'NimbusAI',
    tagline: 'Autonomous data pipelines for enterprise ML teams',
    website: 'https://nimbusai.example.com',
    description: 'NimbusAI builds infrastructure that lets ML teams ship production pipelines without managing servers.',
    latest_funding_round: {
      amount: 42_000_000,
      currency: 'USD',
      date: daysAgo(18),
      stage: 'Series B',
      investors: ['Sequoia', 'Index Ventures'],
    },
    country: 'US',
    region: 'North America',
    city: 'San Francisco, CA',
    industry: ['AI/ML'],
    team_size: 85,
    recent_news: [
      {
        title: 'NimbusAI raises $42M Series B',
        snippet: 'NimbusAI raises $42M Series B led by Sequoia to expand ML infra...',
        source: 'TechCrunch',
        url: 'https://techcrunch.com',
        date: daysAgo(18),
      },
    ],
    job_postings: [
      { title: 'Senior Backend Engineer', platform: 'LinkedIn', url: '#', posted_date: daysAgo(5) },
      { title: 'ML Platform Engineer', platform: 'LinkedIn', url: '#', posted_date: daysAgo(3) },
    ],
    created_at: daysAgo(18),
    updated_at: daysAgo(2),
    source_urls: ['https://techcrunch.com'],
  },
  {
    id: 'c2',
    name: 'Ledgerly',
    tagline: 'Embedded finance APIs for SMB banking',
    website: 'https://ledgerly.example.com',
    description: 'Ledgerly gives fintech apps drop-in ledger, payments, and compliance APIs.',
    latest_funding_round: {
      amount: 18_000_000,
      currency: 'USD',
      date: daysAgo(40),
      stage: 'Series A',
      investors: ['a16z'],
    },
    country: 'UK',
    region: 'Europe',
    city: 'London',
    industry: ['FinTech'],
    team_size: 34,
    recent_news: [
      {
        title: 'Ledgerly closes $18M Series A',
        snippet: 'Ledgerly closes $18M Series A to expand embedded finance suite...',
        source: 'Sifted',
        url: 'https://sifted.eu',
        date: daysAgo(40),
      },
    ],
    job_postings: [{ title: 'Compliance Engineer', platform: 'Wellfound', url: '#', posted_date: daysAgo(20) }],
    created_at: daysAgo(40),
    updated_at: daysAgo(4),
    source_urls: ['https://sifted.eu'],
  },
  {
    id: 'c3',
    name: 'VitalSense',
    tagline: 'Remote patient monitoring for chronic care',
    website: 'https://vitalsense.example.com',
    description: 'VitalSense combines wearables and AI triage to reduce hospital readmissions.',
    latest_funding_round: {
      amount: 65_000_000,
      currency: 'USD',
      date: daysAgo(7),
      stage: 'Series C+',
      investors: ['General Catalyst', 'GV'],
    },
    country: 'US',
    region: 'North America',
    city: 'Boston, MA',
    industry: ['HealthTech'],
    team_size: 210,
    recent_news: [
      {
        title: 'VitalSense raises $65M to scale remote monitoring',
        snippet: 'VitalSense raises $65M Series C to expand into chronic care management...',
        source: 'VentureBeat',
        url: 'https://venturebeat.com',
        date: daysAgo(7),
      },
    ],
    job_postings: [
      { title: 'Clinical Ops Manager', platform: 'LinkedIn', url: '#', posted_date: daysAgo(2) },
      { title: 'Staff Software Engineer', platform: 'LinkedIn', url: '#', posted_date: daysAgo(1) },
      { title: 'Data Scientist', platform: 'Indeed', url: '#', posted_date: daysAgo(4) },
    ],
    created_at: daysAgo(7),
    updated_at: daysAgo(1),
    source_urls: ['https://venturebeat.com'],
  },
  {
    id: 'c4',
    name: 'GreenGrid',
    tagline: 'Grid-scale battery optimization software',
    website: 'https://greengrid.example.com',
    description: 'GreenGrid uses forecasting models to optimize battery dispatch for utilities.',
    latest_funding_round: {
      amount: 9_500_000,
      currency: 'USD',
      date: daysAgo(65),
      stage: 'Seed',
      investors: ['Breakthrough Energy Ventures'],
    },
    country: 'Canada',
    region: 'North America',
    city: 'Toronto',
    industry: ['ClimaTech'],
    team_size: 16,
    recent_news: [
      {
        title: 'GreenGrid raises $9.5M seed round',
        snippet: 'GreenGrid raises $9.5M seed to expand battery optimization platform...',
        source: 'Crunchbase News',
        url: 'https://news.crunchbase.com',
        date: daysAgo(65),
      },
    ],
    job_postings: [],
    created_at: daysAgo(65),
    updated_at: daysAgo(6),
    source_urls: ['https://news.crunchbase.com'],
  },
  {
    id: 'c5',
    name: 'ChainForge',
    tagline: 'Developer tooling for onchain settlement',
    website: 'https://chainforge.example.com',
    description: 'ChainForge provides SDKs for building compliant onchain settlement flows.',
    latest_funding_round: {
      amount: 12_000_000,
      currency: 'USD',
      date: daysAgo(25),
      stage: 'Series A',
      investors: ['Paradigm'],
    },
    country: 'Singapore',
    region: 'Asia-Pacific',
    city: 'Singapore',
    industry: ['Web3'],
    team_size: 22,
    recent_news: [
      {
        title: 'ChainForge raises $12M Series A',
        snippet: 'ChainForge raises $12M Series A led by Paradigm to expand SDK...',
        source: 'TechCrunch',
        url: 'https://techcrunch.com',
        date: daysAgo(25),
      },
    ],
    job_postings: [{ title: 'Developer Relations Engineer', platform: 'LinkedIn', url: '#', posted_date: daysAgo(9) }],
    created_at: daysAgo(25),
    updated_at: daysAgo(3),
    source_urls: ['https://techcrunch.com'],
  },
  {
    id: 'c6',
    name: 'GeneMap',
    tagline: 'AI-driven target discovery for rare diseases',
    website: 'https://genemap.example.com',
    description: 'GeneMap accelerates rare-disease drug discovery using genomic foundation models.',
    latest_funding_round: {
      amount: 30_000_000,
      currency: 'USD',
      date: daysAgo(50),
      stage: 'Series A',
      investors: ['Flagship Pioneering'],
    },
    country: 'US',
    region: 'North America',
    city: 'Cambridge, MA',
    industry: ['BioTech', 'AI/ML'],
    team_size: 48,
    recent_news: [
      {
        title: 'GeneMap raises $30M to expand rare disease pipeline',
        snippet: 'GeneMap raises $30M Series A to expand rare disease drug discovery...',
        source: 'VentureBeat',
        url: 'https://venturebeat.com',
        date: daysAgo(50),
      },
    ],
    job_postings: [{ title: 'Computational Biologist', platform: 'LinkedIn', url: '#', posted_date: daysAgo(12) }],
    created_at: daysAgo(50),
    updated_at: daysAgo(5),
    source_urls: ['https://venturebeat.com'],
  },
  {
    id: 'c7',
    name: 'Classly',
    tagline: 'AI tutoring companion for K-12 classrooms',
    website: 'https://classly.example.com',
    description: 'Classly gives teachers an AI co-pilot for grading, lesson plans, and tutoring.',
    latest_funding_round: {
      amount: 6_000_000,
      currency: 'USD',
      date: daysAgo(90),
      stage: 'Seed',
      investors: ['Reach Capital'],
    },
    country: 'US',
    region: 'North America',
    city: 'Austin, TX',
    industry: ['EdTech', 'AI/ML'],
    team_size: 12,
    recent_news: [
      {
        title: 'Classly raises $6M seed for AI tutoring',
        snippet: 'Classly raises $6M seed round to build AI tutoring co-pilot for teachers...',
        source: 'Product Hunt',
        url: 'https://www.producthunt.com',
        date: daysAgo(90),
      },
    ],
    job_postings: [],
    created_at: daysAgo(90),
    updated_at: daysAgo(10),
    source_urls: ['https://www.producthunt.com'],
  },
  {
    id: 'c8',
    name: 'Fraudwall',
    tagline: 'Real-time transaction fraud detection',
    website: 'https://fraudwall.example.com',
    description: 'Fraudwall uses graph neural networks to catch fraud rings in milliseconds.',
    latest_funding_round: {
      amount: 55_000_000,
      currency: 'USD',
      date: daysAgo(12),
      stage: 'Series B',
      investors: ['Accel', 'Ribbit Capital'],
    },
    country: 'India',
    region: 'Asia-Pacific',
    city: 'Bengaluru',
    industry: ['FinTech', 'AI/ML'],
    team_size: 120,
    recent_news: [
      {
        title: 'Fraudwall raises $55M Series B',
        snippet: 'Fraudwall raises $55M Series B led by Accel to expand fraud detection platform...',
        source: 'YourStory',
        url: 'https://yourstory.com',
        date: daysAgo(12),
      },
    ],
    job_postings: [
      { title: 'Site Reliability Engineer', platform: 'LinkedIn', url: '#', posted_date: daysAgo(3) },
      { title: 'Applied Scientist', platform: 'LinkedIn', url: '#', posted_date: daysAgo(6) },
    ],
    created_at: daysAgo(12),
    updated_at: daysAgo(2),
    source_urls: ['https://yourstory.com'],
  },
  {
    id: 'c9',
    name: 'Skylark Robotics',
    tagline: 'Autonomous inspection drones for industrial sites',
    website: 'https://skylark.example.com',
    description: 'Skylark builds self-piloting drones that inspect refineries and power plants.',
    latest_funding_round: {
      amount: 21_000_000,
      currency: 'USD',
      date: daysAgo(33),
      stage: 'Series A',
      investors: ['Lux Capital'],
    },
    country: 'Germany',
    region: 'Europe',
    city: 'Berlin',
    industry: ['AI/ML', 'ClimaTech'],
    team_size: 40,
    recent_news: [
      {
        title: 'Skylark Robotics raises $21M Series A',
        snippet: 'Skylark Robotics raises $21M to scale autonomous inspection drones...',
        source: 'Sifted',
        url: 'https://sifted.eu',
        date: daysAgo(33),
      },
    ],
    job_postings: [{ title: 'Robotics Engineer', platform: 'LinkedIn', url: '#', posted_date: daysAgo(8) }],
    created_at: daysAgo(33),
    updated_at: daysAgo(3),
    source_urls: ['https://sifted.eu'],
  },
  {
    id: 'c10',
    name: 'Wavefront Health',
    tagline: 'Predictive analytics for hospital staffing',
    website: 'https://wavefront.example.com',
    description: 'Wavefront Health forecasts patient volume to optimize hospital staffing schedules.',
    latest_funding_round: {
      amount: 4_000_000,
      currency: 'USD',
      date: daysAgo(120),
      stage: 'Seed',
      investors: ['Bessemer'],
    },
    country: 'Australia',
    region: 'Asia-Pacific',
    city: 'Sydney',
    industry: ['HealthTech'],
    team_size: 9,
    recent_news: [
      {
        title: 'Wavefront Health raises $4M seed',
        snippet: 'Wavefront Health raises $4M seed to expand predictive staffing platform...',
        source: 'Crunchbase News',
        url: 'https://news.crunchbase.com',
        date: daysAgo(120),
      },
    ],
    job_postings: [],
    created_at: daysAgo(120),
    updated_at: daysAgo(15),
    source_urls: ['https://news.crunchbase.com'],
  },
];

export function withLogo(company: SeedCompany): Omit<Company, 'hiring_confidence'> {
  return { ...company, logo_url: logo(company.name) };
}
