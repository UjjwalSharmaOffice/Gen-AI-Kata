import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../../../common/middleware/validate.js';
import { authenticate, authorize } from '../../../common/middleware/auth.js';
import { inventoryService } from '../service/inventory.service.js';

const router = Router();

const createSchema = z.object({
  name: z.string().min(2),
  quantity: z.number().int().min(0),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  quantity: z.number().int().min(0).optional(),
});

router.get('/', authenticate, async (_req, res, next) => {
  try {
    const items = await inventoryService.listInventory();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, authorize('ADMIN'), validateBody(createSchema), async (req, res, next) => {
  try {
    const item = await inventoryService.createItem(req.body.name, req.body.quantity);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, authorize('ADMIN'), validateBody(updateSchema), async (req, res, next) => {
  try {
    const item = await inventoryService.updateItem((req.params.id as string), req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const result = await inventoryService.deleteItem((req.params.id as string));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export const inventoryRoutes = router;
