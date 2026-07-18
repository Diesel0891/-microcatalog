/**
 * Supabase client initialization for Microcatalog.
 *
 * Uses the Vite environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * The client is configured with default settings — no custom auth or realtime.
 *
 * @module supabase
 * @see {@link https://supabase.com/docs/reference/javascript/initializing}
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Singleton Supabase client instance.
 * Exported for use across the application for database operations.
 *
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
