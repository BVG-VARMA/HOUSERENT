/* eslint-disable no-console */
const timestamp = () => new Date().toISOString();

const logger = {
  info: (msg) => console.log(`[INFO] ${timestamp()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${timestamp()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${timestamp()} - ${msg}`),
};

module.exports = logger;
