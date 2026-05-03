import { durationToSeconds } from '@/src/data/devotionalMedia'
import type { DevotionalMediaItem, SortOption } from '@/src/data/devotionalMedia'

interface FilterOptions {
  searchTerm: string
  activeCategory: 'All' | DevotionalMediaItem['category']
  showOnlyFavorites: boolean
  favorites: string[]
  sortBy: SortOption
}

export function filterAndSortMedia(items: DevotionalMediaItem[], options: FilterOptions): DevotionalMediaItem[] {
  const { searchTerm, activeCategory, showOnlyFavorites, favorites, sortBy } = options
  let next = [...items]

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase()
    next = next.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.tags.some(tag => tag.toLowerCase().includes(q)) ||
      item.transliteration.toLowerCase().includes(q)
    )
  }

  if (activeCategory !== 'All') {
    next = next.filter(item => item.category === activeCategory)
  }

  if (showOnlyFavorites) {
    const set = new Set(favorites)
    next = next.filter(item => set.has(item.id))
  }

  next.sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    }
    if (sortBy === 'duration') {
      return durationToSeconds(b.duration) - durationToSeconds(a.duration)
    }
    return b.popularity - a.popularity
  })

  return next
}

export function toggleFavoriteId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter(x => x !== id) : [id, ...list]
}

export function toRecentlyPlayed(list: string[], id: string, max = 12): string[] {
  return [id, ...list.filter(x => x !== id)].slice(0, max)
}

export function nextPlayState(currentlyPlaying: boolean, action: 'play' | 'pause' | 'toggle'): boolean {
  if (action === 'play') return true
  if (action === 'pause') return false
  return !currentlyPlaying
}

export function isMissingMedia(mediaErrors: Set<string>, id: string): boolean {
  return mediaErrors.has(id)
}
