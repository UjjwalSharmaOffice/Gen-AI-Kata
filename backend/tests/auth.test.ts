import request from 'supertest';
import { app, seedTestDb, cleanupTestDb } from './helpers';

let adminEmail: string;

beforeAll(async () => {
  const seed = await seedTestDb();
  adminEmail = seed.admin.email;
});

afterAll(async () => {
  await cleanupTestDb();
});

describe('POST /api/auth/login', () => {
  it('returns 200 and a token for valid admin credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: adminEmail,
      password: 'admin123',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user).toMatchObject({
      email: adminEmail,
      role: 'ADMIN',
    });
  });

  it('returns 200 and a token for valid employee credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'employee@test.local',
      password: 'employee123',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('EMPLOYEE');
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: adminEmail,
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Invalid credentials');
  });

  it('returns 401 for non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@test.local',
      password: 'admin123',
    });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Invalid credentials');
  });

  it('returns 400 for invalid email format', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'not-an-email',
      password: 'admin123',
    });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({
      password: 'admin123',
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 when password is too short', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: adminEmail,
      password: '12345',
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 for empty body', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });
});