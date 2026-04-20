import { signToken, JwtPayload } from '../src/common/utils/jwt';
import { createApp } from '../src/app';
import { prisma } from '../src/common/utils/prisma';
import bcrypt from 'bcryptjs';

export const app = createApp();

/** Create a JWT for testing */
export function tokenFor(overrides: Partial<JwtPayload> & { userId: string; role: 'ADMIN' | 'EMPLOYEE' }) {
  const payload: JwtPayload = {
    userId: overrides.userId,
    role: overrides.role,
    email: overrides.email ?? `${overrides.role.toLowerCase()}@test.local`,
  };
  return signToken(payload);
}

/** Seed a minimal test database and return references */
export async function seedTestDb() {
  // Clean in dependency order
  await prisma.stockTransaction.deleteMany();
  await prisma.supplyRequestItem.deleteMany();
  await prisma.supplyRequest.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash('admin123', 4); // low rounds for speed
  const employeeHash = await bcrypt.hash('employee123', 4);

  const admin = await prisma.user.create({
    data: {
      name: 'Test Admin',
      email: 'admin@test.local',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: 'Test Employee',
      email: 'employee@test.local',
      passwordHash: employeeHash,
      role: 'EMPLOYEE',
    },
  });

  const paper = await prisma.inventoryItem.create({
    data: { name: 'Paper', quantity: 100 },
  });

  const pen = await prisma.inventoryItem.create({
    data: { name: 'Pen', quantity: 50 },
  });

  const stapler = await prisma.inventoryItem.create({
    data: { name: 'Stapler', quantity: 5 },
  });

  return { admin, employee, paper, pen, stapler };
}

export async function cleanupTestDb() {
  await prisma.stockTransaction.deleteMany();
  await prisma.supplyRequestItem.deleteMany();
  await prisma.supplyRequest.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.user.deleteMany();
}

export { prisma };
