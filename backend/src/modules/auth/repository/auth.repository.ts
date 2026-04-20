import { prisma } from '../../../common/utils/prisma.js';

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
};
