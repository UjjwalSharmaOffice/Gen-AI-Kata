import request from 'supertest';
import { app, seedTestDb, cleanupTestDb, tokenFor } from './helpers';

let adminToken: string;
let employeeToken: string;
let paperId: string;

beforeAll(async () => {
  const seed = await seedTestDb();
  adminToken = tokenFor({ userId: seed.admin.id, role: 'ADMIN', email: seed.admin.email });
  employeeToken = tokenFor({ userId: seed.employee.id, role: 'EMPLOYEE', email: seed.employee.email });
  paperId = seed.paper.id;
});

afterAll(async () => {
  await cleanupTestDb();
});

describe('GET /api/inventory', () => {
  it('returns inventory list for authenticated user', async () => {
    const res = await request(app)
      .get('/api/inventory')
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('quantity');
  });

  it('returns 401 for unauthenticated request', async () => {
    const res = await request(app).get('/api/inventory');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/inventory', () => {
  it('admin can create an inventory item', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Notebook', quantity: 30 });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Notebook');
    expect(res.body.quantity).toBe(30);
  });

  it('returns 409 for duplicate item name', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Paper', quantity: 10 });
    expect(res.status).toBe(409);
    expect(res.body.error.message).toBe('Item already exists');
  });

  it('employee cannot create inventory items (403)', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ name: 'Eraser', quantity: 20 });
    expect(res.status).toBe(403);
  });

  it('returns 400 for missing name', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 10 });
    expect(res.status).toBe(400);
  });

  it('returns 400 for negative quantity', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Tape', quantity: -5 });
    expect(res.status).toBe(400);
  });

  it('returns 400 for non-integer quantity', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Glue', quantity: 2.5 });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/inventory/:id', () => {
  it('admin can update an inventory item name', async () => {
    const res = await request(app)
      .put(`/api/inventory/${paperId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'A4 Paper' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('A4 Paper');
  });

  it('admin can update an inventory item quantity', async () => {
    const res = await request(app)
      .put(`/api/inventory/${paperId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 999 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(999);
  });

  it('employee cannot update inventory (403)', async () => {
    const res = await request(app)
      .put(`/api/inventory/${paperId}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ quantity: 1 });
    expect(res.status).toBe(403);
  });

  it('returns 404 for non-existent item', async () => {
    const res = await request(app)
      .put('/api/inventory/nonexistent-id')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 10 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/inventory/:id', () => {
  let deleteItemId: string;

  beforeAll(async () => {
    // Create a disposable item
    const res = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Disposable Item', quantity: 1 });
    deleteItemId = res.body.id;
  });

  it('admin can delete an inventory item', async () => {
    const res = await request(app)
      .delete(`/api/inventory/${deleteItemId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 404 for already-deleted item', async () => {
    const res = await request(app)
      .delete(`/api/inventory/${deleteItemId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });

  it('employee cannot delete inventory items (403)', async () => {
    const res = await request(app)
      .delete(`/api/inventory/${paperId}`)
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(res.status).toBe(403);
  });
});
