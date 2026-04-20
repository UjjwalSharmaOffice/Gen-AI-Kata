import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../../../common/middleware/validate.js';
import { authService } from '../service/auth.service.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export const authRoutes = router;
