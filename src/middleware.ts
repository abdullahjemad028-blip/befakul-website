import { NextRequest, NextResponse } from "next/server";

const ADMIN_PREFIX  = "/admin";
const LOGIN_PAGE    = "/admin/login";
const COOKIE_NAME   = "admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run on /admin routes
  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  // Allow login page through — no auth needed
  if (pathname === LOGIN_PAGE) {
    return NextResponse.next();
  }

  // Also allow logout API through
  if (pathname === "/api/admin/auth/logout") {
    return NextResponse.next();
  }

  // Check session cookie
  const session = request.cookies.get(COOKIE_NAME);

  if (!session || session.value !== process.env.ADMIN_SECRET) {
    // Not authenticated — redirect to login
    const loginUrl = new URL(LOGIN_PAGE, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated — allow through
  return NextResponse.next();
}

export const config = {
  // Run middleware on all /admin routes + /api/admin routes
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};