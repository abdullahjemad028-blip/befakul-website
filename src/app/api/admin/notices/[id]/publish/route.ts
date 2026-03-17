import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── PATCH /api/admin/notices/[id]/publish ─────────────────────
export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const existing = await prisma.notice.findFirst({
      where: { id: params.id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    const updated = await prisma.notice.update({
      where: { id: params.id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/admin/notices/[id]/publish]", error);
    return NextResponse.json(
      { error: "Failed to publish notice" },
      { status: 500 },
    );
  }
}