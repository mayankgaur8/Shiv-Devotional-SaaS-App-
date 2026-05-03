import { describe, expect, it } from 'vitest'
import { devotionalMedia, getMediaCandidateUrls, getMediaUrl } from '@/src/data/devotionalMedia'

describe('devotional media sources', () => {
  it('keeps a local fallback candidate for Shiv Tandav audio', () => {
    const track = devotionalMedia.find(item => item.id === 'shiv-tandav-stotram')

    expect(track).toBeDefined()
    expect(track?.src).toBe('/audio/ShivaTandavaStotram.mp3')
    expect(getMediaCandidateUrls(track?.src || '', track?.cdnSrc)).toContain('/audio/ShivaTandavaStotram.mp3')
  })

  it('returns a usable media URL for local assets when CDN is not configured', () => {
    expect(getMediaUrl('/audio/ShivaTandavaStotram.mp3')).toBe('/audio/ShivaTandavaStotram.mp3')
  })
})