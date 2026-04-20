import { prisma } from '../../../common/utils/prisma.js';

export const inventoryRepository = {
  list() {
    return prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } });
  },
  findById(id: string) {
    return prisma.inventoryItem.findUnique({ where: { id } });
  },
  create(data: { name: string; quantity: number }) {
    return prisma.inventoryItem.create({ data });
  },
  update(id: string, data: { name?: string; quantity?: number }) {
    return prisma.inventoryItem.update({ where: { id }, data });
  },
  remove(id: string) {
    return prisma.inventoryItem.delete({ where: { id } });
  },
};
