type Level = 'info' | 'warn' | 'error';

function log(level: Level, message: string, meta?: unknown) {
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
  if (meta !== undefined) {
    // eslint-disable-next-line no-console
    console[level === 'info' ? 'log' : level](line, meta);
  } else {
    // eslint-disable-next-line no-console
    console[level === 'info' ? 'log' : level](line);
  }
}

export const logger = {
  info: (message: string, meta?: unknown) => log('info', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
};
