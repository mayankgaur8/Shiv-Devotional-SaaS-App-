import { devotionalMedia } from '@/src/data/devotionalMedia'
import {
  filterAndSortMedia,
  isMissingMedia,
  nextPlayState,
  toRecentlyPlayed,
  toggleFavoriteId,
} from '@/src/lib/bhajan-utils'
import { safeStorageGet, safeStorageSet } from '@/src/lib/safe-storage'

describe('bhajan media utilities', () => {
  it('search filters by title/transliteration/tags', () => {
    const items = filterAndSortMedia(devotionalMedia, {
      searchTerm: 'mrityunjaya',
      activeCategory: 'All',
      showOnlyFavorites: false,
      favorites: [],
      sortBy: 'popular',
    })

    expect(items.some(i => i.id === 'maha-mrityunjaya')).toBe(true)
  })

  it('category filter keeps only matching category', () => {
    const items = filterAndSortMedia(devotionalMedia, {
      searchTerm: '',
      activeCategory: 'Aarti',
      showOnlyFavorites: false,
      favorites: [],
      sortBy: 'popular',
    })

    expect(items.length).toBeGreaterThan(0)
    expect(items.every(i => i.category === 'Aarti')).toBe(true)
  })

  it('play/pause state transition helper works', () => {
    expect(nextPlayState(false, 'play')).toBe(true)
    expect(nextPlayState(true, 'pause')).toBe(false)
    expect(nextPlayState(true, 'toggle')).toBe(false)
    expect(nextPlayState(false, 'toggle')).toBe(true)
  })

  it('marks missing media via error set', () => {
    const errorSet = new Set<string>(['om-namah-shivaya'])
    expect(isMissingMedia(errorSet, 'om-namah-shivaya')).toBe(true)
    expect(isMissingMedia(errorSet, 'maha-mrityunjaya')).toBe(false)
  })

  it('favorite list toggles and persists to recent order', () => {
    let favorites: string[] = []
    favorites = toggleFavoriteId(favorites, 'om-namah-shivaya')
    expect(favorites).toContain('om-namah-shivaya')

    favorites = toggleFavoriteId(favorites, 'om-namah-shivaya')
    expect(favorites).not.toContain('om-namah-shivaya')

    const recent = toRecentlyPlayed(['a', 'b', 'c'], 'b', 3)
    expect(recent).toEqual(['b', 'a', 'c'])
  })
})

describe('safe storage', () => {
  it('persists favorite payload when storage is available', () => {
    const key = 'shiv-favorites-test'
    const payload = JSON.stringify(['om-namah-shivaya'])

    expect(safeStorageSet(key, payload)).toBe(true)
    expect(safeStorageGet(key)).toBe(payload)
  })

  it('returns false/null when localStorage throws', () => {
    const originalSet = Storage.prototype.setItem
    const originalGet = Storage.prototype.getItem

    Storage.prototype.setItem = () => {
      throw new Error('blocked')
    }
    Storage.prototype.getItem = () => {
      throw new Error('blocked')
    }

    expect(safeStorageSet('x', 'y')).toBe(false)
    expect(safeStorageGet('x')).toBeNull()

    Storage.prototype.setItem = originalSet
    Storage.prototype.getItem = originalGet
  })
})
