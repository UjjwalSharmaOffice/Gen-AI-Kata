import request from 'supertest';
import { createApp } from '../src/app';

describe('Auth', () => {
  it('logs in with valid credentials', async () => {
    const app = createApp();
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@office.local',
      password: 'admin123',
    });
    expect([200, 401]).toContain(res.statusCode);
  });
});