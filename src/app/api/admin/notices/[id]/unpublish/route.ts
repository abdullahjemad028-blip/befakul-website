import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Use Prisma.DbNull for nullable DateTime fields
    await prisma.$executeRaw`
      UPDATE notices
      SET "isPublished" = false, "publishedAt" = NULL, "updatedAt" = NOW()
      WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[PATCH unpublish]", error);
    return NextResponse.json(
      { error: "Failed to unpublish notice" },
      { status: 500 },
    );
  }
}