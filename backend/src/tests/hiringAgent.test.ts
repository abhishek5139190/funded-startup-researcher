import { describe, it, expect } from 'vitest';
import { heuristicScore } from '../agents/hiringAgent';
import type { Company } from '../types';

function makeCompany(overrides: Partial<Company>): Company {
  return {
    id: 'x',
    name: 'TestCo',
    logo_url: '',
    tagline: '',
    website: '',
    description: '',
    latest_funding_round: {
      amount: 1_000_000,
      currency: 'USD',
      date: new Date().toISOString(),
      stage: 'Seed',
      investors: [],
    },
    country: 'US',
    region: 'North America',
    city: 'SF',
    industry: ['AI/ML'],
    team_size: 5,
    hiring_confidence: { percent: 0, updated_at: '', reasoning: '', signals: { positive: [], negative: [] } },
    recent_news: [],
    job_postings: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    source_urls: [],
    ...overrides,
  };
}

describe('heuristicScore', () => {
  it('scores a strongly-funded, actively hiring company high', () => {
    const company = makeCompany({
      latest_funding_round: {
        amount: 50_000_000,
        currency: 'USD',
        date: new Date().toISOString(),
        stage: 'Series B',
        investors: [],
      },
      team_size: 100,
      job_postings: [{ title: 'Engineer', platform: 'LinkedIn', url: '#', posted_date: new Date().toISOString() }],
      recent_news: [
        { title: 'Company is hiring aggressively', snippet: 'expanding team', source: 'TC', url: '#', date: new Date().toISOString() },
      ],
    });
    const result = heuristicScore(company);
    expect(result.percent).toBeGreaterThan(70);
    expect(result.signals.positive.length).toBeGreaterThan(0);
  });

  it('scores a stale, unfunded company low', () => {
    const staleDate = new Date();
    staleDate.setDate(staleDate.getDate() - 200);
    const company = makeCompany({
      latest_funding_round: {
        amount: 500_000,
        currency: 'USD',
        date: staleDate.toISOString(),
        stage: 'Seed',
        investors: [],
      },
      team_size: 3,
      job_postings: [],
      recent_news: [],
      updated_at: staleDate.toISOString(),
    });
    const result = heuristicScore(company);
    expect(result.percent).toBeLessThan(40);
    expect(result.signals.negative.length).toBeGreaterThan(0);
  });

  it('penalizes layoff news', () => {
    const company = makeCompany({
      recent_news: [{ title: 'Company announces layoffs', snippet: '', source: 'TC', url: '#', date: new Date().toISOString() }],
    });
    const result = heuristicScore(company);
    expect(result.signals.negative).toContain('Recent layoff/restructuring news');
  });

  it('always returns a percent within 0-100', () => {
    const company = makeCompany({});
    const result = heuristicScore(company);
    expect(result.percent).toBeGreaterThanOrEqual(0);
    expect(result.percent).toBeLessThanOrEqual(100);
  });
});
