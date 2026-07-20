/**
 * Stock status constants and utilities for Microcatalog.
 *
 * Centralizes all stock status logic to ensure consistency across
 * seller upload, public catalog, and AI suggestion flows.
 *
 * @module stockStatus
 */

/**
 * Valid stock status values.
 * @readonly
 * @enum {string}
 */
export const STOCK_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  SOLD: 'sold',
}

/**
 * Human-readable labels for each status.
 * @type {Record<string, string>}
 */
export const STOCK_LABELS = {
  [STOCK_STATUS.AVAILABLE]: 'Available',
  [STOCK_STATUS.RESERVED]: 'Reserved',
  [STOCK_STATUS.SOLD]: 'Sold',
}

/**
 * Tailwind color classes for status badges.
 * Maps to the custom palette in tailwind.config.js.
 * @type {Record<string, {bg: string, text: string, border: string}>}
 */
export const STOCK_COLORS = {
  [STOCK_STATUS.AVAILABLE]: {
    bg: 'bg-sage-100',
    text: 'text-sage-800',
    border: 'border-sage-300',
  },
  [STOCK_STATUS.RESERVED]: {
    bg: 'bg-copper-100',
    text: 'text-copper-800',
    border: 'border-copper-300',
  },
  [STOCK_STATUS.SOLD]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
}

/**
 * Check if a status value is valid.
 *
 * @param {string} status - The status to validate.
 * @returns {boolean}
 */
export function isValidStockStatus(status) {
  return Object.values(STOCK_STATUS).includes(status)
}

/**
 * Get the display label for a status, with fallback.
 *
 * @param {string} status - Raw status value from database.
 * @returns {string} Human-readable label, defaults to 'Available'.
 */
export function getStockLabel(status) {
  return STOCK_LABELS[status] || STOCK_LABELS[STOCK_STATUS.AVAILABLE]
}

/**
 * Get Tailwind color classes for a status badge.
 *
 * @param {string} status - Raw status value.
 * @returns {{bg: string, text: string, border: string}} Color class object.
 */
export function getStockColors(status) {
  return STOCK_COLORS[status] || STOCK_COLORS[STOCK_STATUS.AVAILABLE]
}

/**
 * Determine if an item should allow customer inquiries.
 * Sold items block the WhatsApp tap.
 *
 * @param {string} status - Raw status value.
 * @returns {boolean}
 */
export function isInquirable(status) {
  return status !== STOCK_STATUS.SOLD
}

/**
 * Default status for new items.
 * @type {string}
 */
export const DEFAULT_STOCK_STATUS = STOCK_STATUS.AVAILABLE
