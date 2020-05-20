const { createLogger, format, transports } = require('winston');

const { combine, printf, colorize, errors, splat } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${level}: ${timestamp} | ${message}`;
});

const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'debug',
      format: combine(colorize({ all: true }), format.timestamp(), myFormat),
    }),
    new transports.File({
      filename: 'error.log',
      level: 'error',
      format: combine(
        splat(),
        errors({ stack: true }),
        format.timestamp(),
        format.json()
      ),
    }),
    new transports.File({
      filename: 'SQL.log',
      level: 'verbose',
      format: format.json(),
    }),
  ],
});

export { logger as default };
