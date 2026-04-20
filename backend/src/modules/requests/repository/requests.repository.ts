import { prisma } from '../../../common/utils/prisma.js';
import { RequestStatus } from '@prisma/client';

export const requestsRepository = {
  create(employeeId: string, remarks: string | undefined, items: Array<{ itemId: string; quantity: number }>) {
    return prisma.supplyRequest.create({
      data: {
        employeeId,
        remarks,
        items: {
          create: items,
        },
      },
      include: {
        items: { include: { item: true } },
        employee: { select: { id: true, name: true, email: true } },
      },
    });
  },

  listForUser(userId: string, role: 'ADMIN' | 'EMPLOYEE') {
    return prisma.supplyRequest.findMany({
      where: role === 'ADMIN' ? {} : { employeeId: userId },
      include: {
        items: { include: { item: true } },
        employee: { select: { id: true, name: true, email: true } },
        reviewedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  getById(id: string) {
    return prisma.supplyRequest.findUnique({
      where: { id },
      include: {
        items: { include: { item: true } },
      },
    });
  },

  async approve(requestId: string, reviewerId: string) {
    return prisma.$transaction(async (tx) => {
      const req = await tx.supplyRequest.findUnique({
        where: { id: requestId },
        include: { items: true },
      });

      if (!req) {
        throw { statusCode: 404, message: 'Request not found' };
      }
      if (req.status !== RequestStatus.PENDING) {
        throw { statusCode: 409, message: 'Only pending requests can be approved' };
      }

      for (const row of req.items) {
        const inv = await tx.inventoryItem.findUnique({ where: { id: row.itemId } });
        if (!inv) {
          throw { statusCode: 400, message: 'Inventory item missing during approval' };
        }
        if (inv.quantity < row.quantity) {
          throw { statusCode: 409, message: `Insufficient inventory for item ${inv.name}` };
        }
      }

      for (const row of req.items) {
        const inv = await tx.inventoryItem.update({
          where: { id: row.itemId },
          data: {
            quantity: {
              decrement: row.quantity,
            },
          },
        });

        await tx.stockTransaction.create({
          data: {
            itemId: row.itemId,
            delta: -row.quantity,
            reason: 'REQUEST_APPROVED',
            referenceId: req.id,
            createdById: reviewerId,
          },
        });

        if (inv.quantity < 0) {
          throw { statusCode: 409, message: 'Inventory cannot go negative' };
        }
      }

      return tx.supplyRequest.update({
        where: { id: req.id },
        data: {
          status: RequestStatus.APPROVED,
          reviewedById: reviewerId,
          reviewedAt: new Date(),
          rejectionReason: null,
        },
        include: {
          items: { include: { item: true } },
          employee: { select: { id: true, name: true, email: true } },
          reviewedBy: { select: { id: true, name: true, email: true } },
        },
      });
    });
  },

  async reject(requestId: string, reviewerId: string, reason?: string) {
    return prisma.supplyRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.REJECTED,
        rejectionReason: reason,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
      },
      include: {
        items: { include: { item: true } },
        employee: { select: { id: true, name: true, email: true } },
        reviewedBy: { select: { id: true, name: true, email: true } },
      },
    });
  },
};
