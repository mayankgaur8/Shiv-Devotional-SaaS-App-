export function runWhenIdle(task: () => void, timeout = 1500): void {
  if (typeof window === 'undefined') return

  const idle = (window as Window & { requestIdleCallback?: (cb: () => void, options?: { timeout?: number }) => number }).requestIdleCallback

  if (idle) {
    idle(() => task(), { timeout })
    return
  }

  window.setTimeout(task, 0)
}
