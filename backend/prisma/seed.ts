import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const employeeHash = await bcrypt.hash('employee123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@office.local' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@office.local',
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'employee@office.local' },
    update: {},
    create: {
      name: 'Employee User',
      email: 'employee@office.local',
      passwordHash: employeeHash,
      role: Role.EMPLOYEE,
    },
  });

  const items = [
    { name: 'Printer Paper', quantity: 200 },
    { name: 'Pen', quantity: 500 },
    { name: 'Stapler', quantity: 50 },
  ];

  for (const item of items) {
    await prisma.inventoryItem.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  console.log('Seeded admin: admin@office.local / admin123');
  console.log('Seeded employee: employee@office.local / employee123');
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
