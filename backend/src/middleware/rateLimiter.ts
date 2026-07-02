import type { Request, Response, NextFunction } from 'express';

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const key = req.ip ?? 'unknown';
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    res.status(429).json({ success: false, error: 'Rate limit exceeded. Try again in a minute.' });
    return;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  next();
}
