import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 },
  );

  // Clear the cookie
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   0,   // Expire immediately
    path:     "/",
  });

  return response;
}