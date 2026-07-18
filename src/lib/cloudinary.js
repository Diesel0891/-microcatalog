import { logger } from './logger.js'
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = 'catalog_uploads'

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
