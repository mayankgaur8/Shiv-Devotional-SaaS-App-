import type { DevotionalMediaItem } from '@/src/data/devotionalMedia'

export const MEDIA_SCHEMA_VERSION = '1.0.0'

export interface DevotionalMediaDocument {
  version: string
  updatedAt: string
  items: DevotionalMediaItem[]
}

export interface MediaValidationResult {
  valid: boolean
  errors: string[]
}

const requiredFields: Array<keyof DevotionalMediaItem> = [
  'id',
  'slug',
  'title',
  'artist',
  'type',
  'category',
  'src',
  'thumbnail',
  'duration',
  'description',
  'lyricsHindi',
  'transliteration',
  'meaning',
  'tags',
  'releaseDate',
  'popularity',
  'allowDownload',
]

export function validateMediaData(items: DevotionalMediaItem[]): MediaValidationResult {
  const errors: string[] = []
  const idSet = new Set<string>()

  items.forEach((item, index) => {
    requiredFields.forEach((field) => {
      if (item[field] === undefined || item[field] === null || item[field] === '') {
        errors.push(`Item ${index + 1}: Missing field ${field}`)
      }
    })

    if (idSet.has(item.id)) {
      errors.push(`Item ${index + 1}: Duplicate id ${item.id}`)
    }
    idSet.add(item.id)

    if (item.src.startsWith('http://') || item.thumbnail.startsWith('http://')) {
      errors.push(`Item ${index + 1}: Insecure URL detected. Use https.`)
    }
  })

  return { valid: errors.length === 0, errors }
}

export function exportMediaData(items: DevotionalMediaItem[]): DevotionalMediaDocument {
  return {
    version: MEDIA_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    items,
  }
}

export function importMediaData(document: DevotionalMediaDocument): MediaValidationResult {
  if (!document.version || !Array.isArray(document.items)) {
    return { valid: false, errors: ['Invalid media document structure'] }
  }

  return validateMediaData(document.items)
}
