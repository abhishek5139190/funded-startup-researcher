import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { searchRouter } from './routes/search';
import { companiesRouter } from './routes/companies';
import { cacheRouter } from './routes/cache';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';
import './db';

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', companiesRouter);
app.use('/api', cacheRouter);
app.use('/api', rateLimiter, searchRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ success: false, error: 'Malformed JSON in request body.' });
    return;
  }
  logger.error('Unhandled error', err);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

export default app;
