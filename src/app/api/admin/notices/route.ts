import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NoticeCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

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
        category:    true,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      title_bn:  string;
      body_bn:   string;
      isPdf:     boolean;
      pdfUrl:    string | null;
      category:  string;
      imageUrl:  string | null;
      publish:   boolean;
    };

    // Validate required fields
    if (!body.title_bn?.trim() || body.title_bn.trim().length < 5) {
      return NextResponse.json(
        { error: "শিরোনাম কমপক্ষে ৫ অক্ষর হতে হবে" },
        { status: 400 },
      );
    }
    if (!body.body_bn?.trim() || body.body_bn.trim().length < 20) {
      return NextResponse.json(
        { error: "বিবরণ কমপক্ষে ২০ অক্ষর হতে হবে" },
        { status: 400 },
      );
    }
    if (body.isPdf && !body.pdfUrl?.trim()) {
      return NextResponse.json(
        { error: "PDF URL দিতে হবে" },
        { status: 400 },
      );
    }

    // Category validate করুন
    const validCategories = Object.values(NoticeCategory);
    const category = validCategories.includes(body.category as NoticeCategory)
      ? (body.category as NoticeCategory)
      : NoticeCategory.GENERAL;

    const notice = await prisma.notice.create({
      data: {
        title_bn:    body.title_bn.trim(),
        body_bn:     body.body_bn.trim(),
        isPdf:       body.isPdf    ?? false,
        pdfUrl:      body.isPdf    ? (body.pdfUrl?.trim() ?? null) : null,
        imageUrl:    body.imageUrl?.trim() || null,
        category,
        isPublished: body.publish  ?? false,
        publishedAt: body.publish  ? new Date() : null,
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