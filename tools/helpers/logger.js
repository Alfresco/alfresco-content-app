const { createLogger, transports, format } = require('winston');
const { yellow, green, red, blue, magenta, cyan } = require('chalk');

const levels = {
  error: red,
  warn: yellow,
  info: cyan,
  verbose: magenta,
  debug: green,
  silly: blue
};

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `[${levels[level](timestamp)}]: ${message}`;
});

module.exports = createLogger({
  level: 'silly',
  format: format.combine(
    // format.splat(),
    format.timestamp(),
    format.prettyPrint(),
    myFormat
  ),
  transports: [new transports.Console()]
});
