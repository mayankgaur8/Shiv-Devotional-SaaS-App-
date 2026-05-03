const controlChars = /[\u0000-\u001F\u007F]/g

export function sanitizeText(input: string): string {
  return input.replace(controlChars, '').trim()
}
