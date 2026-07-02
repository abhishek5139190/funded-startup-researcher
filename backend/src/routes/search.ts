import { Router } from 'express';
import { randomUUID } from 'crypto';
import { scrapeCompanies } from '../services/scraperService';
import { validateFilters } from '../utils/validateFilters';
import { db } from '../db';
import { logger } from '../utils/logger';

export const searchRouter = Router();

searchRouter.post('/search', async (req, res) => {
  const { valid, error, filters } = validateFilters(req.body);
  if (!valid || !filters) {
    res.status(400).json({ success: false, error: error ?? 'Invalid filters.' });
    return;
  }

  try {
    const companies = await scrapeCompanies(filters);

    db.prepare(
      'INSERT INTO search_history (id, filters, results_count, created_at, is_saved) VALUES (?, ?, ?, ?, 0)',
    ).run(randomUUID(), JSON.stringify(filters), companies.length, new Date().toISOString());

    res.json({
      success: true,
      data: {
        companies,
        count: companies.length,
        cached: false,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    logger.error('Search failed', err);
    res.status(500).json({ success: false, error: 'Search failed. Please try again.' });
  }
});
