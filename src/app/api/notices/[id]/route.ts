import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid notice ID" }, { status: 400 });
  }

  try {
    const notice = await prisma.notice.findFirst({
      where: {
        id:          id,
        isPublished: true,
        deletedAt:   null,
      },
      select: {
        id:          true,
        title_bn:    true,
        body_bn:     true,
        publishedAt: true,
        isPdf:       true,
        pdfUrl:      true,
      },
    });

    if (!notice) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    return NextResponse.json(notice, { status: 200 });

  } catch (error) {
    console.error("[GET /api/notices/[id]] Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}