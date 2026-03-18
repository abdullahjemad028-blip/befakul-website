export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_PAGE  = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT     = 50;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const rawPage  = searchParams.get("page")     ?? String(DEFAULT_PAGE);
  const rawLimit = searchParams.get("limit")    ?? String(DEFAULT_LIMIT);
  const search   = searchParams.get("search")   ?? "";
  const category = searchParams.get("category") ?? "";

  const page  = parseInt(rawPage,  10);
  const limit = parseInt(rawLimit, 10);

  if (!Number.isInteger(page) || page < 1) {
    return NextResponse.json(
      { error: "page must be a positive integer" },
      { status: 400 },
    );
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return NextResponse.json(
      { error: `limit must be between 1 and ${MAX_LIMIT}` },
      { status: 400 },
    );
  }

  const now = new Date();

  const where = {
    isPublished: true,
    deletedAt:   null,
    publishedAt: { lte: now },
    // Search — title এ partial match
    ...(search && {
      title_bn: { contains: search, mode: "insensitive" as const },
    }),
    // Category filter
    ...(category && { category: category as never }),
  };

  try {
    const skip = (page - 1) * limit;

    const [total, notices] = await Promise.all([
      prisma.notice.count({ where }),
      prisma.notice.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        select: {
          id:          true,
          title_bn:    true,
          publishedAt: true,
          isPdf:       true,
          pdfUrl:      true,
          category:    true,  // নতুন
          imageUrl:    true,  // নতুন
        },
      }),
    ]);

    return NextResponse.json(
      {
        data: notices,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/notices]", error);
    return NextResponse.json(
      { error: "Failed to fetch notices" },
      { status: 500 },
    );
  }
}