import request from 'supertest';
import { createApp } from '../src/app';

describe('Requests RBAC', () => {
  it('blocks anonymous request creation', async () => {
    const app = createApp();
    const res = await request(app).post('/api/requests').send({
      items: [{ itemId: 'x', quantity: 1 }],
    });
    expect(res.statusCode).toBe(401);
  });
});