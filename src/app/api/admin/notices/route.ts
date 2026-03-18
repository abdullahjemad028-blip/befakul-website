import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── GET /api/admin/notices ────────────────────────────────────
// Returns ALL notices including drafts and archived (admin view)
export async function GET(_request: NextRequest) {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id:          true,
        title_bn:    true,
        isPublished: true,
        isPdf:       true,
        publishedAt: true,
        createdAt:   true,
        deletedAt:   true,
      },
    });

    return NextResponse.json({ data: notices }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/notices]", error);
    return NextResponse.json(
      { error: "Failed to fetch notices" },
      { status: 500 },
    );
  }
}

// ── POST /api/admin/notices ───────────────────────────────────
// Create a new notice (draft or published)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
  title_bn:   string;
  body_bn:    string;
  isPdf:      boolean;
  pdfUrl:     string | null;
  category:   string;   // নতুন
  imageUrl:   string | null; // নতুন
  publish:    boolean;
};

    // Validate required fields
    if (!body.title_bn || body.title_bn.trim().length < 5) {
      return NextResponse.json(
        { error: "title_bn must be at least 5 characters" },
        { status: 400 },
      );
    }

    if (!body.body_bn || body.body_bn.trim().length < 20) {
      return NextResponse.json(
        { error: "body_bn must be at least 20 characters" },
        { status: 400 },
      );
    }

    if (body.isPdf && !body.pdfUrl) {
      return NextResponse.json(
        { error: "pdfUrl is required when isPdf is true" },
        { status: 400 },
      );
    }

    const notice = await prisma.notice.create({
  data: {
    title_bn:    body.title_bn.trim(),
    body_bn:     body.body_bn.trim(),
    isPdf:       body.isPdf ?? false,
    pdfUrl:      body.isPdf ? (body.pdfUrl ?? null) : null,
    category:    (body.category ?? "GENERAL") as never,
    imageUrl:    body.imageUrl?.trim() || null,
    isPublished: body.publish ?? false,
    publishedAt: body.publish ? new Date() : null,
  },
});

    return NextResponse.json({ data: notice }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/notices]", error);
    return NextResponse.json(
      { error: "Failed to create notice" },
      { status: 500 },
    );
  }
}