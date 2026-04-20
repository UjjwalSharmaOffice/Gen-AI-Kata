import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../../../common/middleware/auth.js';
import { validateBody } from '../../../common/middleware/validate.js';
import { requestsService } from '../service/requests.service.js';

const router = Router();

const createRequestSchema = z.object({
  remarks: z.string().max(500).optional(),
  items: z.array(
    z.object({
      itemId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

const rejectSchema = z.object({
  reason: z.string().max(500).optional(),
});

router.post('/', authenticate, authorize('EMPLOYEE'), validateBody(createRequestSchema), async (req, res, next) => {
  try {
    const request = await requestsService.createRequest(req.user!.userId, req.body.remarks, req.body.items);
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const data = await requestsService.listRequests(req.user!.userId, req.user!.role);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/approve', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const result = await requestsService.approveRequest((req.params.id as string), req.user!.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/reject', authenticate, authorize('ADMIN'), validateBody(rejectSchema), async (req, res, next) => {
  try {
    const result = await requestsService.rejectRequest((req.params.id as string), req.user!.userId, req.body.reason);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export const requestsRoutes = router;
