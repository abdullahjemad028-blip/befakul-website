import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME  = "admin_session";
const LOGIN_PAGE   = "/admin/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth routes — সবসময় allow করুন
  if (
    pathname === LOGIN_PAGE ||
    pathname.startsWith("/api/admin/auth/")
  ) {
    return NextResponse.next();
  }

  // Admin routes + Admin API — session check করুন
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin/")
  ) {
    const session = request.cookies.get(COOKIE_NAME);

    if (!session || session.value !== process.env.ADMIN_SECRET) {
      // API request হলে JSON error return করুন
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 },
        );
      }
      // Page request হলে login এ redirect করুন
      const loginUrl = new URL(LOGIN_PAGE, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};