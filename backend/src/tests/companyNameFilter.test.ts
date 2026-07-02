import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('POST /api/search company_name filter', () => {
  it('matches a company by exact name', async () => {
    const res = await request(app)
      .post('/api/search')
      .send({ company_name: 'NimbusAI', sector: [], stage: [], news_type: 'Funding', geography: [] });

    expect(res.status).toBe(200);
    expect(res.body.data.companies).toHaveLength(1);
    expect(res.body.data.companies[0].name).toBe('NimbusAI');
  });

  it('matches case-insensitively and by substring', async () => {
    const res = await request(app)
      .post('/api/search')
      .send({ company_name: 'nimbus', sector: [], stage: [], news_type: 'Funding', geography: [] });

    expect(res.status).toBe(200);
    expect(res.body.data.companies).toHaveLength(1);
  });

  it('returns empty for a name with no match', async () => {
    const res = await request(app)
      .post('/api/search')
      .send({ company_name: 'NoSuchCompanyXYZ', sector: [], stage: [], news_type: 'Funding', geography: [] });

    expect(res.status).toBe(200);
    expect(res.body.data.companies).toEqual([]);
  });

  it('shows varied sources across the seed dataset (not just one source)', async () => {
    const res = await request(app)
      .post('/api/search')
      .send({ sector: [], stage: [], news_type: 'Funding', geography: [] });

    const sources = new Set(res.body.data.companies.map((c: { recent_news: { source: string }[] }) => c.recent_news[0].source));
    expect(sources.size).toBeGreaterThan(1);
  });
});
