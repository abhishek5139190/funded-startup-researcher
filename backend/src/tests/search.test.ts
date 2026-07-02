import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('POST /api/search', () => {
  it('rejects a non-object body', async () => {
    const res = await request(app).post('/api/search').set('Content-Type', 'application/json').send('null');
    expect(res.status).toBe(400);
  });

  it('returns companies matching sector filter', async () => {
    const res = await request(app)
      .post('/api/search')
      .send({ sector: ['AI/ML'], stage: [], news_type: 'Funding', geography: [] });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.companies.length).toBeGreaterThan(0);
    for (const company of res.body.data.companies) {
      expect(company.industry).toContain('AI/ML');
      expect(company.hiring_confidence.percent).toBeGreaterThanOrEqual(0);
      expect(company.hiring_confidence.percent).toBeLessThanOrEqual(100);
    }
  });

  it('returns an empty list for a sector with no matches', async () => {
    const res = await request(app)
      .post('/api/search')
      .send({ sector: ['NoSuchSector'], stage: [], news_type: 'Funding', geography: [] });

    expect(res.status).toBe(200);
    expect(res.body.data.companies).toEqual([]);
  });

  it('filters by funding range', async () => {
    const res = await request(app)
      .post('/api/search')
      .send({ sector: [], stage: [], news_type: 'Funding', geography: [], funding_min_max: [0, 10] });

    expect(res.status).toBe(200);
    for (const company of res.body.data.companies) {
      expect(company.latest_funding_round.amount).toBeLessThanOrEqual(10_000_000);
    }
  });

  it('rate limits after 5 requests per minute', async () => {
    let lastStatus = 200;
    for (let i = 0; i < 6; i++) {
      const res = await request(app).post('/api/search').send({});
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
