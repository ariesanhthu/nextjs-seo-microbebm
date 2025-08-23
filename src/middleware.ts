// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const clerkMw = clerkMiddleware(async (auth, req) =>
{
    const claims = (await auth()).sessionClaims;
    if (isAdminRoute(req) && claims?.metadata?.role !== "admin")
    {
        const url = new URL("/", req.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
});

export default async function middleware(req: NextRequest, event: NextFetchEvent)
{
    const DISABLED =
        process.env.NEXT_PUBLIC_DISABLE_AUTH === "true" ||
        process.env.NODE_ENV === "development"; // an toàn: dev mặc định tắt

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
