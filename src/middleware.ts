// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limit/rate-limit-middleware";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)", "/sign-in(.*)", "/sign-up(.*)"]);
const isContactRoute = createRouteMatcher(["/api/contact(.*)"]);
const isAuthRoute = createRouteMatcher(["/api/auth(.*)", "/sign-in(.*)", "/sign-up(.*)"]);

const clerkMw = clerkMiddleware(async (auth, req) =>
{
    const claims = (await auth()).sessionClaims;
    if (isAdminRoute(req) && claims?.metadata?.role !== "admin")
    {
        const url = new URL("/", req.url);
        return NextResponse.redirect(url);
    }

    if (req.method !== "GET" && claims?.metadata?.role !== "admin") {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
});

const checkRateLimit = (req: NextRequest) => {
  // Check if rate limiting is enabled
  if (process.env.RATE_LIMIT_ENABLED === 'false') {
    return null;
  }

  // Determine the rate limit type
  let rateLimitType: 'api' | 'auth' | 'contact' | 'none' = 'none';

  if (isApiRoute(req)) {
    rateLimitType = 'api';
  }
  if (isContactRoute(req)) {
    rateLimitType = 'contact';
  }
  if (isAuthRoute(req)) {
    rateLimitType = 'auth';
  }

  if (rateLimitType === 'none') {
    return null; // No rate limiting for this route
  }

  return withRateLimit(req, rateLimitType);
};

export default async function middleware(req: NextRequest, event: NextFetchEvent)
{  
    // Rate limiting
    if (process.env.RATE_LIMIT_ENABLED === 'true') {
        const rateLimitResponse = checkRateLimit(req);
    
        if (rateLimitResponse) {
            return rateLimitResponse; // Rate limit exceeded
        }
    }

    const DISABLED =
        process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"; 

    // CORS headers 
    const setCORS = (res: NextResponse) =>
    {
        res.headers.set("Access-Control-Allow-Origin", "*");
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return res;
    };

    if (DISABLED)
    {
        const res = NextResponse.next();
        return setCORS(res);
    }

    // Production
    
    const res = await clerkMw(req, event);

    if (res instanceof NextResponse) setCORS(res);

    return res;
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // API & TRPC
        "/(api|trpc)(.*)",
        "/api/:path*",
        // Admin
        "/admin/:path*",
    ],
};
