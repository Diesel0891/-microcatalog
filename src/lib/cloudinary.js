/**
 * Cloudinary unsigned upload integration for Microcatalog.
 *
 * Uses an unsigned upload preset ('catalog_uploads') to allow direct browser uploads
 * without a custom backend. This is a deliberate v1 simplification — see spec §5.
 *
 * @module cloudinary
 * @see {@link https://cloudinary.com/documentation/upload_images#unsigned_upload}
 */

import { logger } from './logger.js'

/** Cloudinary cloud name from Vite environment variable. */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

/**
 * Unsigned upload preset configured in the Cloudinary dashboard.
 * Must allow unsigned uploads for this to work without a backend signature.
 */
const UPLOAD_PRESET = 'catalog_uploads'

/**
 * Upload a single image file to Cloudinary using an unsigned preset.
 *
 * @param {File} file - The image file from a file input or drag-and-drop.
 * @returns {Promise<string>} The Cloudinary secure_url for the uploaded image.
 * @throws {Error} If the upload fails (network error or Cloudinary rejects the file).
 */
export async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    logger.error('Cloudinary', 'Upload failed', { status: response.status, response: errorText })
    throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.secure_url
}
