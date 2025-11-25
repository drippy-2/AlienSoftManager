/**
 * Image Upload Utility
 * Handles file uploads to /public/uploads/ folder
 */

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB
const UPLOAD_DIR = 'uploads'

/**
 * Handle image file upload
 * @param {File} file - The image file to upload
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function uploadImage(file) {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: 'Only PNG, JPEG, and WEBP images are supported'
    }
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: 'File size must be less than 3MB'
    }
  }

  try {
    // Read file as data URL
    const dataUrl = await readFileAsDataURL(file)

    // Generate unique filename
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substr(2, 9)
    const extension = getFileExtension(file.name)
    const filename = `image-${timestamp}-${randomSuffix}.${extension}`

    // Store in localStorage (simulating workspace storage)
    // In a real app, this would be sent to backend
    const imageData = {
      filename,
      dataUrl,
      uploadedAt: new Date().toISOString(),
      size: file.size
    }

    // Get existing images from localStorage
    let images = []
    try {
      const stored = localStorage.getItem('aliensoft_uploaded_images')
      images = stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('Failed to read images from localStorage:', e)
      images = []
    }

    // Add new image
    images.push(imageData)

    // Save back to localStorage
    localStorage.setItem('aliensoft_uploaded_images', JSON.stringify(images))

    // Return relative URL path (used in product thumbnail)
    const imageUrl = `/${UPLOAD_DIR}/${filename}`

    return {
      success: true,
      base64: dataUrl, // Return base64 encoded image
      url: imageUrl, // Also return URL path for reference
      dataUrl // Also return dataUrl for immediate preview
    }
  } catch (error) {
    console.error('Image upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload image. Please try again.'
    }
  }
}

/**
 * Read file as data URL
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}

/**
 * Get file extension from filename
 * @param {string} filename
 * @returns {string}
 */
function getFileExtension(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
    return ext === 'jpg' ? 'jpg' : ext
  }
  return 'jpg'
}

/**
 * Get image preview URL
 * For uploaded images stored as data URLs in localStorage
 * @param {string} thumbnailUrl
 * @returns {string}
 */
export function getImagePreviewUrl(thumbnailUrl) {
  if (!thumbnailUrl) {
    return '/fallback.jpg'
  }

  // If it's a data URL or /uploads/ path, try to get from localStorage
  if (thumbnailUrl.startsWith('data:') || thumbnailUrl.startsWith('/uploads/')) {
    try {
      const images = JSON.parse(localStorage.getItem('aliensoft_uploaded_images') || '[]')
      const filename = thumbnailUrl.split('/').pop()
      const image = images.find(img => img.filename === filename)
      if (image && image.dataUrl) {
        return image.dataUrl
      }
    } catch (e) {
      console.error('Failed to get image preview:', e)
    }
  }

  // Return external URL or fallback
  return thumbnailUrl || '/fallback.jpg'
}
