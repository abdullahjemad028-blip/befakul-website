import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: { id: string } };

// PUT — Update madrasa
export async function PUT(
  request: NextRequest,
  { params }: RouteParams,
) {
  try {
    const existing = await prisma.madrasa.findFirst({
      where: { id: params.id, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Madrasa not found" },
        { status: 404 },
      );
    }

    const body = await request.json() as {
      name_bn:         string;
      registrationNo:  string;
      district:        string;
      division:        string;
      establishedYear: number | null;
      isActive:        boolean;
    };

    if (!body.name_bn?.trim() || !body.registrationNo?.trim()) {
      return NextResponse.json(
        { error: "নাম ও রেজিস্ট্রেশন নম্বর আবশ্যক" },
        { status: 400 },
      );
    }

    // Check registrationNo uniqueness (exclude self)
    const duplicate = await prisma.madrasa.findFirst({
      where: {
        registrationNo: body.registrationNo.trim(),
        NOT: { id: params.id },
      },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "এই রেজিস্ট্রেশন নম্বর ইতিমধ্যে আছে" },
        { status: 409 },
      );
    }

    const updated = await prisma.madrasa.update({
      where: { id: params.id },
      data: {
        name_bn:         body.name_bn.trim(),
        registrationNo:  body.registrationNo.trim(),
        district:        body.district.trim(),
        division:        body.division.trim(),
        establishedYear: body.establishedYear ?? null,
        isActive:        body.isActive,
      },
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/admin/madrasas/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update madrasa" },
      { status: 500 },
    );
  }
}

// DELETE — Soft delete
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams,
) {
  try {
    const existing = await prisma.madrasa.findFirst({
      where: { id: params.id, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Madrasa not found" },
        { status: 404 },
      );
    }

    await prisma.madrasa.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        isActive:  false,
      },
    });

    return NextResponse.json(
      { message: "Madrasa archived successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DELETE /api/admin/madrasas/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete madrasa" },
      { status: 500 },
    );
  }
}