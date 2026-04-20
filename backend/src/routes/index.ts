import { Router } from 'express';
import { authRoutes } from '../modules/auth/controller/auth.controller.js';
import { inventoryRoutes } from '../modules/inventory/controller/inventory.controller.js';
import { requestsRoutes } from '../modules/requests/controller/requests.controller.js';
import { authenticate, authorize } from '../common/middleware/auth.js';
import { historyService } from '../modules/history/controller/history.controller.js';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/requests', requestsRoutes);

router.get('/history', authenticate, authorize('ADMIN'), async (_req, res, next) => {
  try {
    const data = await historyService.requestHistory();
    res.json(data);
  } catch (err) {
    next(err);
  }
});
