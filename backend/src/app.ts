import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router } from './routes/index.js';
import { notFound } from './common/middleware/not-found.js';
import { errorHandler } from './common/middleware/error-handler.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());

  app.use('/api', router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
