/**
 * Stock status badge component.
 *
 * Displays a small, color-coded badge indicating an item's availability.
 * Used in both seller upload cards and public catalog grid.
 *
 * @module StockStatusBadge
 */

import { getStockLabel, getStockColors } from '../lib/stockStatus.js'

/**
 * Render a stock status badge.
 *
 * @param {Object} props
 * @param {string} props.status - Raw status value ('available', 'reserved', 'sold').
 * @param {string} [props.size='sm'] - Badge size: 'sm' or 'xs'.
 * @returns {JSX.Element}
 */
export default function StockStatusBadge({ status, size = 'sm' }) {
  const label = getStockLabel(status)
  const colors = getStockColors(status)

  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-1.5 py-0.5'
    : 'text-xs px-2.5 py-1'

  return (
    <span
      className={[
        'inline-flex items-center font-semibold rounded-full border',
        sizeClasses,
        colors.bg,
        colors.text,
        colors.border,
      ].join(' ')}
    >
      {label}
    </span>
  )
}
