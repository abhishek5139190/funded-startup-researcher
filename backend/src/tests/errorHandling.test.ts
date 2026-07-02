import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('malformed request bodies', () => {
  it('returns 400 (not 500) for a JSON body that is not an object', async () => {
    const res = await request(app).post('/api/search').set('Content-Type', 'application/json').send('null');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for unparsable JSON syntax', async () => {
    const res = await request(app).post('/api/search').set('Content-Type', 'application/json').send('{not valid json');
    expect(res.status).toBe(400);
  });
});
