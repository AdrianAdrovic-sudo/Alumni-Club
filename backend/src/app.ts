import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import logger from './utils/logger';
import router from './routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

logger.info('✅ App initialized successfully.');

// sve API rute pod /api
app.use('/api', router);

// 404 mora ići POSLE svih ruta
app.use(notFound);

// globalni error handler POSLE 404
app.use(errorHandler);

export default app;
