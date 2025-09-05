import { NextRequest, NextResponse } from 'next/server';
import rateLimiter, { getClientIdentifier, RATE_LIMITS } from './rate-limiter';

export type RateLimitType = keyof typeof RATE_LIMITS;

export async function withRateLimit(
  request: NextRequest,
  type: RateLimitType = 'api',
  customIdentifier?: string
): Promise<NextResponse | null> {
  if (process.env.RATE_LIMIT_ENABLED === 'false') {
    return null;
  }
  const identifier = customIdentifier || getClientIdentifier(request);
  const config = RATE_LIMITS[type];
  const result = await rateLimiter.check(
    `${type}:${identifier}`,
    config.limit,
    config.windowMs
  );
  // console.log("Rate limit result:", result);
  
  if (!result.success) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`,
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': config.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetTime.toString(),
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  
  // Add rate limit headers to successful responses
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', config.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
  
  return null; // Continue with request
}