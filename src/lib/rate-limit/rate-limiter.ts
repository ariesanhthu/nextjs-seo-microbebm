// In-memory rate limiter - no database required
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimiter {
  private cache = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.resetTime) {
        this.cache.delete(key);
      }
    }
  }

  async check(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{
    success: boolean;
    count: number;
    remaining: number;
    resetTime: number;
  }> {
    const now = Date.now();
    const resetTime = now + windowMs;
    
    const existing = this.cache.get(identifier);
    
    if (!existing || now >= existing.resetTime) {
      // Create new entry or reset expired entry
      this.cache.set(identifier, {
        count: 1,
        resetTime
      });
      
      return {
        success: true,
        count: 1,
        remaining: limit - 1,
        resetTime
      };
    }
    
    // Check if limit exceeded
    if (existing.count >= limit) {
      return {
        success: false,
        count: existing.count,
        remaining: 0,
        resetTime: existing.resetTime
      };
    }
    
    // Increment count
    existing.count++;
    this.cache.set(identifier, existing);
    
    return {
      success: true,
      count: existing.count,
      remaining: limit - existing.count,
      resetTime: existing.resetTime
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// Singleton instance
const rateLimiter = new InMemoryRateLimiter();

export default rateLimiter;

// Helper function to get client identifier
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  let ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  // You can also include user agent for more specific rate limiting
  const userAgent = request.headers.get('user-agent') || '';
  
  return `${ip}-${userAgent.slice(0, 50)}`;
}

// Rate limiting configurations
export const RATE_LIMITS = {
  // General API requests
  api: {
    limit: parseInt(process.env.RATE_LIMIT_API_REQUESTS || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_API_WINDOW_MS || '900000'), // 15 minutes
  },
  // Authentication endpoints
  auth: {
    limit: parseInt(process.env.RATE_LIMIT_AUTH_REQUESTS || '15'),
    windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || '900000'), // 15 minutes
  },
  // Contact form submissions
  contact: {
    limit: parseInt(process.env.RATE_LIMIT_CONTACT_REQUESTS || '5'),
    windowMs: parseInt(process.env.RATE_LIMIT_CONTACT_WINDOW_MS || '3600000'), // 1 hour
  },
} as const;
