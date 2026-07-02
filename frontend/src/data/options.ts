import type { FundingStage, NewsType } from '../types';

export const SECTORS = [
  'AI/ML',
  'FinTech',
  'HealthTech',
  'ClimaTech',
  'Web3',
  'BioTech',
  'EdTech',
] as const;

export const STAGES: FundingStage[] = [
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
  'Undisclosed',
];

export const NEWS_TYPES: NewsType[] = [
  'Funding',
  'Hiring',
  'Awards',
  'Product Launch',
];

export const REGIONS = ['North America', 'Europe', 'Asia-Pacific', 'Other'] as const;

export const COUNTRIES = [
  'US',
  'UK',
  'India',
  'Singapore',
  'Canada',
  'Germany',
  'France',
  'Australia',
] as const;
