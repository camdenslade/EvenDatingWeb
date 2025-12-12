/**
 * Input sanitization and validation utilities
 */

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 10000) // Limit length
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate name (letters, spaces, hyphens, apostrophes only)
 */
export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-Z\s'-]+$/
  return nameRegex.test(name) && name.length >= 2 && name.length <= 100
}

/**
 * Validate message length
 */
export function isValidMessage(message: string): boolean {
  const sanitized = sanitizeInput(message)
  return sanitized.length >= 10 && sanitized.length <= 5000
}

/**
 * Validate subject length
 */
export function isValidSubject(subject: string): boolean {
  const sanitized = sanitizeInput(subject)
  return sanitized.length >= 3 && sanitized.length <= 200
}

/**
 * Check for potential spam patterns
 */
export function containsSpamPatterns(text: string): boolean {
  const spamPatterns = [
    /(http|https|www\.)/gi,
    /[A-Z]{10,}/, // Excessive caps
    /(.)\1{4,}/, // Repeated characters
  ]
  
  return spamPatterns.some(pattern => pattern.test(text))
}

/**
 * Generate a simple CSRF token (in production, this should come from the server)
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate CSRF token format
 */
export function isValidCSRFToken(token: string): boolean {
  return /^[a-f0-9]{32}$/.test(token)
}

