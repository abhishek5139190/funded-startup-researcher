import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('GET /api/companies/:id', () => {
  it('returns a company by id', async () => {
    const res = await request(app).get('/api/companies/c1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('c1');
    expect(res.body.data.name).toBe('NimbusAI');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get('/api/companies/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/companies/:id/hiring-analysis', () => {
  it('returns hiring confidence data', async () => {
    const res = await request(app).get('/api/companies/c3/hiring-analysis');
    expect(res.status).toBe(200);
    expect(res.body.data.percent).toBeGreaterThanOrEqual(0);
    expect(res.body.data.percent).toBeLessThanOrEqual(100);
    expect(typeof res.body.data.reasoning).toBe('string');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get('/api/companies/does-not-exist/hiring-analysis');
    expect(res.status).toBe(404);
  });
});
