/**
 * Product card component for seller upload.
 *
 * Displays a single product with image, editable fields, AI suggest,
 * and stock status controls. Extracted from Upload.jsx to improve
 * modularity and maintainability.
 *
 * @module ProductCard
 */

import { useState } from 'react'
import {
  Loader2,
  Trash2,
  Sparkles,
  Plus,
  AlertCircle,
  Check,
} from 'lucide-react'
import StockStatusBadge from './StockStatusBadge.jsx'
import StockStatusSelector from './StockStatusSelector.jsx'
import { useStockStatus } from '../hooks/useStockStatus.js'
import { logger } from '../lib/logger.js'
import { DEFAULT_STOCK_STATUS } from '../lib/stockStatus.js'

/**
 * Render a single product card.
 *
 * @param {Object} props
 * @param {Object} props.item - The product item object.
 * @param {boolean} props.showBulkBar - Whether bulk selection is active.
 * @param {boolean} props.isSelected - Whether this item is selected for bulk apply.
 * @param {() => void} props.onToggleSelect - Toggle selection for bulk apply.
 * @param {() => void} props.onRemove - Remove this item.
 * @param {(field: string, value: string) => void} props.onUpdateField - Update a field value.
 * @param {() => void} props.onSuggest - Trigger AI suggest.
 * @param {boolean} props.isSuggesting - Whether AI suggest is in progress.
 * @param {boolean} props.showAiError - Whether to show AI error for this item.
 * @returns {JSX.Element}
 */
export default function ProductCard({
  item,
  showBulkBar,
  isSelected,
  onToggleSelect,
  onRemove,
  onUpdateField,
  onSuggest,
  isSuggesting,
  showAiError,
}) {
  const { updateStatus, updating: statusUpdating } = useStockStatus()
  const [localStatus, setLocalStatus] = useState(
    item.stock_status || DEFAULT_STOCK_STATUS
  )

  const handleStatusChange = async (newStatus) => {
    setLocalStatus(newStatus)
    if (item.dbId) {
      const success = await updateStatus(item.dbId, newStatus)
      if (!success) {
        // Revert on failure
        setLocalStatus(item.stock_status || DEFAULT_STOCK_STATUS)
        logger.warn('ProductCard', 'Status update failed, reverted', {
          dbId: item.dbId,
        })
      }
    }
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border overflow-hidden transition ${
        isSelected
          ? 'border-copper-400 ring-2 ring-copper-100'
          : 'border-stone-200'
      }`}
    >
      {showBulkBar && (
        <div className="px-4 pt-3 pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="w-5 h-5 text-copper-600 rounded focus:ring-copper-500 border-stone-300"
            />
            <span className="text-sm text-charcoal-600 font-medium">
              Select for bulk apply
            </span>
          </label>
        </div>
      )}

      <div className="relative">
        <img
          src={item.imageUrl}
          alt="Product"
          className="w-full h-48 object-cover"
        />
        {item.uploading && (
          <div className="absolute inset-0 bg-charcoal-950/60 flex items-center justify-center backdrop-blur-sm">
            <Loader2
              className="w-6 h-6 text-white animate-spin"
              strokeWidth={2}
            />
          </div>
        )}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-white/90 text-charcoal-700 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition shadow-sm"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>

        {/* Stock Status Badge - top-left overlay */}
        <div className="absolute top-2 left-2">
          <StockStatusBadge status={localStatus} size="xs" />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <button
          onClick={onSuggest}
          disabled={!item.saved || item.uploading || isSuggesting}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-copper-200 bg-copper-50 text-copper-700 text-sm font-medium hover:bg-copper-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {isSuggesting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" strokeWidth={2} />
              Suggest Details (Beta)
            </>
          )}
        </button>

        {showAiError && (
          <p className="text-copper-700 text-xs mt-2 text-center bg-copper-50 border border-copper-200 rounded-lg py-2 px-3">
            Suggestions aren't ready. Please fill in the details manually.
          </p>
        )}

        {/* Stock Status Selector */}
        <StockStatusSelector
          currentStatus={localStatus}
          onChange={handleStatusChange}
          disabled={statusUpdating || item.uploading}
        />

        <input
          type="text"
          placeholder="Title *"
          value={item.title}
          onChange={(e) => onUpdateField('title', e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-copper-400 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Price *"
          value={item.price}
          onChange={(e) => onUpdateField('price', e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-copper-400 focus:border-transparent"
        />

        <details className="group">
          <summary className="flex items-center gap-2 text-sm text-copper-600 cursor-pointer font-medium select-none">
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Details
          </summary>
          <div className="mt-3 space-y-3">
            <textarea
              placeholder="Description"
              value={item.description}
              onChange={(e) => onUpdateField('description', e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 h-20 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-copper-400 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Size / Specs"
              value={item.sizeSpecs}
              onChange={(e) => onUpdateField('sizeSpecs', e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-copper-400 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Extra Notes"
              value={item.extraNotes}
              onChange={(e) => onUpdateField('extraNotes', e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-copper-400 focus:border-transparent"
            />
          </div>
        </details>

        {item.error && (
          <p className="text-red-600 text-sm flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
            {item.error}
          </p>
        )}
        {item.saved && !item.error && (
          <p className="text-sage-600 text-sm flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
            Saved
          </p>
        )}
      </div>
    </div>
  )
}
