import request from 'supertest';
import { createApp } from '../src/app';

describe('Health', () => {
  it('returns healthy status', async () => {
    const app = createApp();
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});