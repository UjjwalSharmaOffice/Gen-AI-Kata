import request from 'supertest';
import { app, seedTestDb, cleanupTestDb, tokenFor, prisma } from './helpers';

let adminToken: string;
let employeeToken: string;
let adminId: string;
let employeeId: string;
let paperId: string;
let penId: string;
let staplerId: string;

beforeAll(async () => {
  const seed = await seedTestDb();
  adminId = seed.admin.id;
  employeeId = seed.employee.id;
  adminToken = tokenFor({ userId: adminId, role: 'ADMIN', email: seed.admin.email });
  employeeToken = tokenFor({ userId: employeeId, role: 'EMPLOYEE', email: seed.employee.email });
  paperId = seed.paper.id;
  penId = seed.pen.id;
  staplerId = seed.stapler.id;
});

afterAll(async () => {
  await cleanupTestDb();
});

describe('POST /api/requests (create)', () => {
  it('blocks anonymous request creation (401)', async () => {
    const res = await request(app).post('/api/requests').send({
      items: [{ itemId: paperId, quantity: 1 }],
    });
    expect(res.status).toBe(401);
  });

  it('admin cannot create a request (403)', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ items: [{ itemId: paperId, quantity: 1 }] });
    expect(res.status).toBe(403);
  });

  it('employee can create a supply request', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        remarks: 'Need supplies',
        items: [
          { itemId: paperId, quantity: 5 },
          { itemId: penId, quantity: 3 },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('PENDING');
    expect(res.body.items).toHaveLength(2);
    expect(res.body.employee.email).toBe('employee@test.local');
  });

  it('returns 400 for empty items array', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ items: [] });
    expect(res.status).toBe(400);
  });

  it('returns 400 for non-existent inventory item', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ items: [{ itemId: 'fake-id', quantity: 1 }] });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('do not exist');
  });

  it('returns 400 for zero quantity', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ items: [{ itemId: paperId, quantity: 0 }] });
    expect(res.status).toBe(400);
  });

  it('returns 400 for negative quantity', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ items: [{ itemId: paperId, quantity: -1 }] });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/requests (list)', () => {
  it('employee sees only their own requests', async () => {
    const res = await request(app)
      .get('/api/requests')
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    for (const r of res.body) {
      expect(r.employee.email).toBe('employee@test.local');
    }
  });

  it('admin sees all requests', async () => {
    const res = await request(app)
      .get('/api/requests')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('returns 401 for unauthenticated user', async () => {
    const res = await request(app).get('/api/requests');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/requests/:id/approve', () => {
  let requestId: string;

  beforeAll(async () => {
    // Create a fresh request to approve
    const r = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ items: [{ itemId: penId, quantity: 2 }] });
    requestId = r.body.id;
  });

  it('admin can approve a pending request', async () => {
    const penBefore = await prisma.inventoryItem.findUnique({ where: { id: penId } });
    const res = await request(app)
      .post(`/api/requests/${requestId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('APPROVED');
    expect(res.body.reviewedBy).toBeTruthy();

    // Verify inventory was decremented
    const penAfter = await prisma.inventoryItem.findUnique({ where: { id: penId } });
    expect(penAfter!.quantity).toBe(penBefore!.quantity - 2);
  });

  it('returns 409 when approving an already-approved request', async () => {
    const res = await request(app)
      .post(`/api/requests/${requestId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(409);
  });

  it('employee cannot approve a request (403)', async () => {
    const res = await request(app)
      .post(`/api/requests/${requestId}/approve`)
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(res.status).toBe(403);
  });

  it('returns 404 for non-existent request', async () => {
    const res = await request(app)
      .post('/api/requests/fake-id/approve')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});

describe('POST /api/requests/:id/approve (insufficient inventory)', () => {
  let requestId: string;

  beforeAll(async () => {
    // Stapler has qty 5; request more than available
    const r = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ items: [{ itemId: staplerId, quantity: 999 }] });
    requestId = r.body.id;
  });

  it('returns 409 when inventory is insufficient', async () => {
    const res = await request(app)
      .post(`/api/requests/${requestId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(409);
    expect(res.body.error.message).toContain('Insufficient');
  });
});

describe('POST /api/requests/:id/reject', () => {
  let requestId: string;

  beforeAll(async () => {
    const r = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ items: [{ itemId: paperId, quantity: 1 }] });
    requestId = r.body.id;
  });

  it('admin can reject a pending request with reason', async () => {
    const res = await request(app)
      .post(`/api/requests/${requestId}/reject`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Not needed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('REJECTED');
    expect(res.body.rejectionReason).toBe('Not needed');
  });

  it('returns 409 when rejecting an already-rejected request', async () => {
    const res = await request(app)
      .post(`/api/requests/${requestId}/reject`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Again' });
    expect(res.status).toBe(409);
  });

  it('employee cannot reject a request (403)', async () => {
    const res = await request(app)
      .post(`/api/requests/${requestId}/reject`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({});
    expect(res.status).toBe(403);
  });

  it('returns 404 for non-existent request', async () => {
    const res = await request(app)
      .post('/api/requests/fake-id/reject')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(404);
  });

  it('admin can reject without a reason', async () => {
    const r = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ items: [{ itemId: paperId, quantity: 1 }] });
    const res = await request(app)
      .post(`/api/requests/${r.body.id}/reject`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('REJECTED');
  });
});