import { prisma } from '../../../common/utils/prisma.js';

export const historyService = {
  async requestHistory() {
    const requests = await prisma.supplyRequest.findMany({
      include: {
        items: { include: { item: true } },
        employee: { select: { name: true, email: true } },
        reviewedBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return requests.map((r) => ({
      id: r.id,
      status: r.status,
      remarks: r.remarks,
      rejectionReason: r.rejectionReason,
      createdAt: r.createdAt,
      reviewedAt: r.reviewedAt,
      employee: r.employee,
      reviewedBy: r.reviewedBy,
      items: r.items.map((it) => ({
        itemName: it.item.name,
        quantity: it.quantity,
      })),
    }));
  },
};
