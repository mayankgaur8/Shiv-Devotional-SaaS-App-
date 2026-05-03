export function safeStorageGet(key: string): string | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeStorageSet(key: string, value: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}
