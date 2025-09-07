// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limit/rate-limit-middleware";

// ONLY protect these:
const isAdminRoute = createRouteMatcher([
  "/admin(.*)",      // pages under /admin
  "/api/admin(.*)",  // APIs under /api/admin (nếu có)
]);

const setCORS = (res: NextResponse) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Preflight (vẫn đi qua Clerk để Clerk "nhìn thấy" middleware)
  if (req.method === "OPTIONS") {
    return setCORS(new NextResponse(null, { status: 204 }));
  }

  // (Tuỳ chọn) Rate limit — chỉ nên trả về Response khi bị chặn, còn cho phép thì trả null
  if (process.env.RATE_LIMIT_ENABLED === "true") {
    // tuỳ bạn gắn type theo route; ví dụ: API chung
    const rl = await withRateLimit(req, "api");
    if (rl) return setCORS(rl);
  }

  // ✅ Chỉ bảo vệ /admin & /api/admin
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();
    const role =
      (sessionClaims as any)?.metadata?.role ??
      (sessionClaims as any)?.publicMetadata?.role ??
      null;

    // Chưa đăng nhập hoặc không phải admin -> chuyển tới đăng nhập
    if (!userId || role !== "admin") {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url); // quay lại sau khi login
      return NextResponse.redirect(signInUrl);
    }
  }

  // Tất cả route khác: luôn cho qua (không yêu cầu đăng nhập)
  return setCORS(NextResponse.next());
});

// Matcher: chạy middleware cho toàn bộ app & API
// (an toàn vì ta CHỈ enforce auth bên trong isAdminRoute)
export const config = {
  matcher: [
    "/((?!_next|.*\\..*|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
};
