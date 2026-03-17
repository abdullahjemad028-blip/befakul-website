import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME    = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours in seconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      username: string;
      password: string;
    };

    const { username, password } = body;

    // Validate input exists
    if (!username || !password) {
      return NextResponse.json(
        { error: "ব্যবহারকারীর নাম ও পাসওয়ার্ড দিন" },
        { status: 400 },
      );
    }

    // Compare with .env credentials
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;
    const secret        = process.env.ADMIN_SECRET;

    if (!validUsername || !validPassword || !secret) {
      console.error("[Login] Admin credentials not set in .env");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const isValid =
      username === validUsername && password === validPassword;

    if (!isValid) {
      // Intentionally vague — do not reveal which field is wrong
      return NextResponse.json(
        { error: "ব্যবহারকারীর নাম বা পাসওয়ার্ড ভুল" },
        { status: 401 },
      );
    }

    // Build response and set httpOnly cookie
    const response = NextResponse.json(
      { success: true },
      { status: 200 },
    );

    response.cookies.set(COOKIE_NAME, secret, {
      httpOnly: true,   // JS cannot access — XSS protection
      secure:   process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax",
      maxAge:   COOKIE_MAX_AGE,
      path:     "/",
    });

    return response;

  } catch (error) {
    console.error("[POST /api/admin/auth/login]", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    );
  }
}