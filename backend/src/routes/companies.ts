import { Router } from 'express';
import { getCompanyById } from '../services/scraperService';
import { logger } from '../utils/logger';

export const companiesRouter = Router();

companiesRouter.get('/companies/:id', async (req, res) => {
  try {
    const company = await getCompanyById(req.params.id);
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found.' });
      return;
    }
    res.json({ success: true, data: company });
  } catch (err) {
    logger.error('Failed to load company', err);
    res.status(500).json({ success: false, error: 'Failed to load company.' });
  }
});

companiesRouter.get('/companies/:id/hiring-analysis', async (req, res) => {
  try {
    const company = await getCompanyById(req.params.id);
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found.' });
      return;
    }
    res.json({ success: true, data: company.hiring_confidence });
  } catch (err) {
    logger.error('Failed to load hiring analysis', err);
    res.status(500).json({ success: false, error: 'Failed to load hiring analysis.' });
  }
});
