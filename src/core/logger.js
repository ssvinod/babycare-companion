/**
 * BabyCare Companion Logger
 * -------------------------
 * Central logging utility.
 * Future:
 *  - File logging
 *  - Cloud logging
 *  - Debug mode
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

let currentLevel = LOG_LEVELS.INFO;

function timestamp() {
  return new Date().toISOString();
}

function log(level, message, ...args) {
  if (LOG_LEVELS[level] < currentLevel) return;

  console.log(
    `[${timestamp()}] [${level}] ${message}`,
    ...args
  );
}

export const logger = {
  setLevel(level) {
    if (LOG_LEVELS[level] !== undefined) {
      currentLevel = LOG_LEVELS[level];
    }
  },

  debug(message, ...args) {
    log("DEBUG", message, ...args);
  },

  info(message, ...args) {
    log("INFO", message, ...args);
  },

  warn(message, ...args) {
    log("WARN", message, ...args);
  },

  error(message, ...args) {
    log("ERROR", message, ...args);
  },
};