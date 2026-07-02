export type FundingStage =
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Series C+'
  | 'Undisclosed';

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
  sector: string[];
  stage: FundingStage[];
  news_type: NewsType;
  geography: string[];
  funding_min_max?: [number, number];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  about: string;
  cache_enabled: boolean;
  created_at: string;
  last_updated_at: string;
  last_synced_cache_at?: string;
}

export interface SearchCache {
  cache_key: string;
  filters: SearchFilters;
  results: Company[];
  count: number;
  cached_at: string;
  expires_at: string;
  is_fresh: boolean;
}

export interface SearchHistoryEntry {
  filters: SearchFilters;
  count: number;
  searched_at: string;
  cached: boolean;
}

export interface SearchResult {
  companies: Company[];
  count: number;
  cached: boolean;
  timestamp: string;
}
