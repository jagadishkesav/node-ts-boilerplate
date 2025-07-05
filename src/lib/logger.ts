import { createLogger, transports, format, addColors } from 'winston';
import config from '@/config';

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Tell winston that we want to link the colors
// defined above to the severity levels.
addColors(colors);

// Tell winston that you want to print out
// also the stack trace of the error cause.
const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

// Create the logger instance that has to be exported
// and used to log messages.
export const logger = createLogger({
  level: config.node_env === 'development' ? 'debug' : 'info',
  // Chose the aspect of your log customizing the log format.
  format: format.combine(
    // Add the error message format
    enumerateErrorFormat(),
    // Add the message timestamp with the preferred format
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // Tell Winston that the logs must be colored
    format.colorize({ all: true }),
    // Define the format of the message showing the timestamp, the level and the message
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  // Define which transports the logger must use to print out messages.
  transports: [
    // Allow to print all the error level messages inside the error.log file
    new transports.File({
      filename: 'src/logs/error.log',
      level: 'error'
    }),
    // Allow to print all the error message inside the all.log file
    // also the error log that are also printed inside the error.log file
    new transports.File({ filename: 'src/logs/all.log' }),
    // Allow the console to print the messages
    new transports.Console({
      stderrLevels: ['error']
    })
  ]
});
