/**
 * Stock status update hook.
 *
 * Provides a function to update an item's stock status in Supabase.
 * Handles loading state, error handling, and logging.
 *
 * @module useStockStatus
 */

import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger.js'
import { isValidStockStatus, DEFAULT_STOCK_STATUS } from '../lib/stockStatus.js'

/**
 * Hook for updating stock status.
 *
 * @returns {{
 *   updateStatus: (dbId: string, status: string) => Promise<boolean>,
 *   updating: boolean,
 *   error: string | null
 * }}
 */
export function useStockStatus() {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)

  const updateStatus = useCallback(async (dbId, status) => {
    if (!dbId) {
      logger.warn('StockStatus', 'Cannot update: missing dbId')
      return false
    }

    const normalizedStatus = isValidStockStatus(status) ? status : DEFAULT_STOCK_STATUS

    setUpdating(true)
    setError(null)

    try {
      const { error: supabaseError } = await supabase
        .from('catalog_items')
        .update({ stock_status: normalizedStatus })
        .eq('id', dbId)

      if (supabaseError) {
        throw supabaseError
      }

      logger.info('StockStatus', 'Status updated', { dbId, status: normalizedStatus })
      return true
    } catch (err) {
      const message = err.message || 'Failed to update status'
      logger.error('StockStatus', 'Update failed', { dbId, status: normalizedStatus, message })
      setError(message)
      return false
    } finally {
      setUpdating(false)
    }
  }, [])

  return { updateStatus, updating, error }
}
