import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Use pino-pretty only in development for performance in production
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: { colorize: true },
        }
      : undefined,
});

export default logger;
