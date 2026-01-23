interface RateLimitEntry {
  count: number
  resetTime: number
}

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes in milliseconds
const MAX_REQUESTS = 5 // Maximum requests per window

/**
 * Rate limiter using localStorage to track requests
 * Prevents abuse by limiting form submissions
 */
export class RateLimiter {
  private storageKey: string

  constructor(storageKey: string) {
    this.storageKey = storageKey
  }

  /**
   * Check if the user can make a request
   * @returns true if allowed, false if rate limited
   */
  canMakeRequest(): boolean {
    const now = Date.now()
    const stored = localStorage.getItem(this.storageKey)

    if (!stored) {
      // First request, initialize
      this.recordRequest()
      return true
    }

    try {
      const entry: RateLimitEntry = JSON.parse(stored)
      
      // Check if window has expired
      if (now > entry.resetTime) {
        // Reset window
        this.recordRequest()
        return true
      }

      // Check if limit exceeded
      if (entry.count >= MAX_REQUESTS) {
        return false
      }

      // Increment count
      this.recordRequest()
      return true
    } catch (error) {
      // If parsing fails, reset
      this.recordRequest()
      return true
    }
  }

  /**
   * Record a request
   */
  recordRequest(): void {
    const now = Date.now()
    const stored = localStorage.getItem(this.storageKey)

    let entry: RateLimitEntry

    if (stored) {
      try {
        entry = JSON.parse(stored)
        // If window expired, reset
        if (now > entry.resetTime) {
          entry = { count: 1, resetTime: now + RATE_LIMIT_WINDOW }
        } else {
          entry.count += 1
        }
      } catch {
        entry = { count: 1, resetTime: now + RATE_LIMIT_WINDOW }
      }
    } else {
      entry = { count: 1, resetTime: now + RATE_LIMIT_WINDOW }
    }

    localStorage.setItem(this.storageKey, JSON.stringify(entry))
  }

  /**
   * Get time remaining until rate limit resets (in seconds)
   */
  getTimeRemaining(): number {
    const stored = localStorage.getItem(this.storageKey)
    if (!stored) return 0

    try {
      const entry: RateLimitEntry = JSON.parse(stored)
      const now = Date.now()
      const remaining = Math.max(0, entry.resetTime - now)
      return Math.ceil(remaining / 1000)
    } catch {
      return 0
    }
  }

  /**
   * Get remaining requests in current window
   */
  getRemainingRequests(): number {
    const stored = localStorage.getItem(this.storageKey)
    if (!stored) return MAX_REQUESTS

    try {
      const entry: RateLimitEntry = JSON.parse(stored)
      const now = Date.now()
      
      if (now > entry.resetTime) {
        return MAX_REQUESTS
      }

      return Math.max(0, MAX_REQUESTS - entry.count)
    } catch {
      return MAX_REQUESTS
    }
  }

  /**
   * Reset rate limit (for testing or admin purposes)
   */
  reset(): void {
    localStorage.removeItem(this.storageKey)
  }
}

