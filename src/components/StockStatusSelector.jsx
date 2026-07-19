/**
 * Stock status selector component.
 *
 * Allows sellers to change an item's availability status.
 * Displays three options as a button group: Available, Reserved, Sold.
 * Updates are handled via an onChange callback — this component is stateless.
 *
 * @module StockStatusSelector
 */

import { STOCK_STATUS, getStockColors, getStockLabel } from '../lib/stockStatus.js'

/**
 * Render a stock status selector button group.
 *
 * @param {Object} props
 * @param {string} props.currentStatus - Currently selected status.
 * @param {(status: string) => void} props.onChange - Called when a status is selected.
 * @param {boolean} [props.disabled=false] - Whether the selector is disabled.
 * @returns {JSX.Element}
 */
export default function StockStatusSelector({ currentStatus, onChange, disabled = false }) {
  const statuses = [STOCK_STATUS.AVAILABLE, STOCK_STATUS.RESERVED, STOCK_STATUS.SOLD]

  return (
    <div className="flex items-center gap-1.5">
      {statuses.map((status) => {
        const colors = getStockColors(status)
        const isActive = currentStatus === status

        return (
          <button
            key={status}
            type="button"
            onClick={() => !disabled && onChange(status)}
            disabled={disabled}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150',
              isActive
                ? `${colors.bg} ${colors.text} ${colors.border} ring-1 ring-offset-1`
                : 'bg-white text-charcoal-400 border-stone-200 hover:bg-stone-50',
              disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
            ].join(' ')}
            aria-pressed={isActive}
          >
            {getStockLabel(status)}
          </button>
        )
      })}
    </div>
  )
}
