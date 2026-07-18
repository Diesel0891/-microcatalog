/**
 * Centralized structured logging for Microcatalog.
 * Zero-backend: uses console methods only. No external service.
 * Never logs sensitive data (API keys, tokens, passwords).
 */

const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
}

// Default minimum level. In production, could be raised to WARN or ERROR.
const MIN_LEVEL = LEVELS.DEBUG

function formatMessage(level, context, message, meta = {}) {
  const timestamp = new Date().toISOString()
  const metaStr = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''
  return `[${timestamp}] [${level}] [${context}] ${message}${metaStr}`
}

function log(levelValue, levelName, context, message, meta) {
  if (levelValue < MIN_LEVEL) return

  const formatted = formatMessage(levelName, context, message, meta)

  switch (levelName) {
    case 'DEBUG':
      console.debug(formatted)
      break
    case 'INFO':
      console.info(formatted)
      break
    case 'WARN':
      console.warn(formatted)
      break
    case 'ERROR':
    case 'FATAL':
      console.error(formatted)
      break
  }
}

export const logger = {
  debug: (context, message, meta) => log(LEVELS.DEBUG, 'DEBUG', context, message, meta),
  info: (context, message, meta) => log(LEVELS.INFO, 'INFO', context, message, meta),
  warn: (context, message, meta) => log(LEVELS.WARN, 'WARN', context, message, meta),
  error: (context, message, meta) => log(LEVELS.ERROR, 'ERROR', context, message, meta),
  fatal: (context, message, meta) => log(LEVELS.FATAL, 'FATAL', context, message, meta),
}
