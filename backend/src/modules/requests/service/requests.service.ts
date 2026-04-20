import { requestsRepository } from '../repository/requests.repository.js';
import { prisma } from '../../../common/utils/prisma.js';

export const requestsService = {
  async createRequest(employeeId: string, remarks: string | undefined, items: Array<{ itemId: string; quantity: number }>) {
    if (!items.length) {
      throw { statusCode: 400, message: 'At least one item is required' };
    }

    const ids = items.map((i) => i.itemId);
    const existing = await prisma.inventoryItem.findMany({ where: { id: { in: ids } } });
    if (existing.length !== ids.length) {
      throw { statusCode: 400, message: 'One or more inventory items do not exist' };
    }

    return requestsRepository.create(employeeId, remarks, items);
  },

  listRequests(userId: string, role: 'ADMIN' | 'EMPLOYEE') {
    return requestsRepository.listForUser(userId, role);
  },

  approveRequest(requestId: string, reviewerId: string) {
    return requestsRepository.approve(requestId, reviewerId);
  },

  async rejectRequest(requestId: string, reviewerId: string, reason?: string) {
    const existing = await requestsRepository.getById(requestId);
    if (!existing) {
      throw { statusCode: 404, message: 'Request not found' };
    }
    if (existing.status !== 'PENDING') {
      throw { statusCode: 409, message: 'Only pending requests can be rejected' };
    }

    return requestsRepository.reject(requestId, reviewerId, reason);
  },
};
