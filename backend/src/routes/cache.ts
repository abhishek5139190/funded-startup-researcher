import { Router } from 'express';
import { clearScraperCache, getScraperCacheStats } from '../services/scraperService';

export const cacheRouter = Router();

cacheRouter.post('/cache/clear', (_req, res) => {
  const cleared = clearScraperCache();
  res.json({ success: true, data: { cleared } });
});

cacheRouter.get('/cache/size', (_req, res) => {
  const stats = getScraperCacheStats();
  res.json({ success: true, data: { size_mb: stats.sizeMb, count: stats.count } });
});
