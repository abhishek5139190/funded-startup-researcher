export type FundingStage = 'Seed' | 'Series A' | 'Series B' | 'Series C+' | 'Undisclosed';
export type NewsType = 'Funding' | 'Hiring' | 'Awards' | 'Product Launch';

export interface NewsItem {
  title: string;
  snippet: string;
  source: string;
  url: string;
  date: string;
}

export interface JobPosting {
  title: string;
  platform: string;
  url: string;
  posted_date: string;
}

export interface HiringConfidence {
  percent: number;
  updated_at: string;
  reasoning: string;
  signals: {
    positive: string[];
    negative: string[];
  };
}

export interface Company {
  id: string;
  name: string;
  logo_url: string;
  tagline: string;
  website: string;
  description: string;
  latest_funding_round: {
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP';
    date: string;
    stage: FundingStage;
    investors: string[];
  };
  country: string;
  region: string;
  city: string;
  industry: string[];
  team_size: number;
  hiring_confidence: HiringConfidence;
  recent_news: NewsItem[];
  job_postings: JobPosting[];
  created_at: string;
  updated_at: string;
  source_urls: string[];
}

export interface SearchFilters {
  company_name?: string;
  sector: string[];
  stage: FundingStage[];
  news_type: NewsType;
  geography: string[];
  funding_min_max?: [number, number];
}
