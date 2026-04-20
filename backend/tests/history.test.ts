import request from 'supertest';
import { app, seedTestDb, cleanupTestDb, tokenFor, prisma } from './helpers';

let adminToken: string;
let employeeToken: string;
let employeeId: string;
let paperId: string;

beforeAll(async () => {
  const seed = await seedTestDb();
  adminToken = tokenFor({ userId: seed.admin.id, role: 'ADMIN', email: seed.admin.email });
  employeeToken = tokenFor({ userId: seed.employee.id, role: 'EMPLOYEE', email: seed.employee.email });
  employeeId = seed.employee.id;
  paperId = seed.paper.id;

  // Create some requests for history
  await prisma.supplyRequest.create({
    data: {
      employeeId,
      status: 'APPROVED',
      remarks: 'Old request',
      reviewedById: seed.admin.id,
      reviewedAt: new Date(),
      items: { create: [{ itemId: paperId, quantity: 2 }] },
    },
  });
  await prisma.supplyRequest.create({
    data: {
      employeeId,
      status: 'REJECTED',
      remarks: 'Rejected one',
      rejectionReason: 'No stock',
      reviewedById: seed.admin.id,
      reviewedAt: new Date(),
      items: { create: [{ itemId: paperId, quantity: 10 }] },
    },
  });
});

afterAll(async () => {
  await cleanupTestDb();
});

describe('GET /api/history', () => {
  it('admin can view request history', async () => {
    const res = await request(app)
      .get('/api/history')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    // Verify response shape
    const entry = res.body[0];
    expect(entry).toHaveProperty('id');
    expect(entry).toHaveProperty('status');
    expect(entry).toHaveProperty('employee');
    expect(entry).toHaveProperty('items');
    expect(Array.isArray(entry.items)).toBe(true);
    expect(entry.items[0]).toHaveProperty('itemName');
    expect(entry.items[0]).toHaveProperty('quantity');
  });

  it('employee cannot view history (403)', async () => {
    const res = await request(app)
      .get('/api/history')
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(res.status).toBe(403);
  });

  it('unauthenticated user cannot view history (401)', async () => {
    const res = await request(app).get('/api/history');
    expect(res.status).toBe(401);
  });
});
