import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── Constants ────────────────────────────────────────────────
const DEFAULT_PAGE  = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT     = 50;

// ── GET /api/notices ─────────────────────────────────────────
export async function GET(request: NextRequest) {
  // ── 1. Parse query params ──────────────────────────────────
  const { searchParams } = request.nextUrl;

  const rawPage  = searchParams.get("page")  ?? String(DEFAULT_PAGE);
  const rawLimit = searchParams.get("limit") ?? String(DEFAULT_LIMIT);

  // ── 2. Validate: must be positive integers ─────────────────
  const page  = parseInt(rawPage,  10);
  const limit = parseInt(rawLimit, 10);

  if (
    !Number.isInteger(page)  || page  < 1 ||
    !Number.isInteger(limit) || limit < 1
  ) {
    return NextResponse.json(
      {
        error:   "Invalid query parameters",
        message: "page and limit must be positive integers",
      },
      { status: 400 },
    );
  }

  if (limit > MAX_LIMIT) {
    return NextResponse.json(
      {
        error:   "Invalid query parameters",
        message: `limit must not exceed ${MAX_LIMIT}`,
      },
      { status: 400 },
    );
  }

  // ── 3. Build shared Prisma where clause ────────────────────
  const now = new Date();

  const where = {
    isPublished: true,
    deletedAt:   null,
    publishedAt: { lte: now },
  };

  // ── 4. Query DB ────────────────────────────────────────────
  try {
    const skip = (page - 1) * limit;

    // Run count + findMany in parallel — single round-trip cost
    const [total, notices] = await Promise.all([
      prisma.notice.count({ where }),
      prisma.notice.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        // body_bn is intentionally excluded from list view
        select: {
          id:          true,
          title_bn:    true,
          publishedAt: true,
          isPdf:       true,
          pdfUrl:      true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // ── 5. Return response ─────────────────────────────────
    return NextResponse.json(
      {
        data: notices,
        meta: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      { status: 200 },
    );

  } catch (error) {
    console.error("[GET /api/notices] Database error:", error);

    return NextResponse.json(
      {
        error:   "Internal server error",
        message: "Failed to fetch notices",
      },
      { status: 500 },
    );
  }
}