import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: { id: string } };

// ── PUT /api/admin/notices/[id] ───────────────────────────────
// Update notice content
export async function PUT(
  request: NextRequest,
  { params }: RouteParams,
) {
  try {
    const existing = await prisma.notice.findFirst({
      where: { id: params.id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    const body = await request.json() as {
      title_bn: string;
      body_bn:  string;
      isPdf:    boolean;
      pdfUrl:   string | null;
    };

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

    const updated = await prisma.notice.update({
      where: { id: params.id },
      data: {
        title_bn: body.title_bn.trim(),
        body_bn:  body.body_bn.trim(),
        isPdf:    body.isPdf ?? false,
        pdfUrl:   body.isPdf ? (body.pdfUrl ?? null) : null,
      },
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/admin/notices/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update notice" },
      { status: 500 },
    );
  }
}

// ── DELETE /api/admin/notices/[id] ───────────────────────────
// Soft delete — sets deletedAt, never removes from DB
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams,
) {
  try {
    const existing = await prisma.notice.findFirst({
      where: { id: params.id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    await prisma.notice.update({
      where: { id: params.id },
      data: {
        deletedAt:   new Date(),
        isPublished: false,
      },
    });

    return NextResponse.json(
      { message: "Notice archived successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DELETE /api/admin/notices/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete notice" },
      { status: 500 },
    );
  }
}