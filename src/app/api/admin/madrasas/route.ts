import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — Admin list (all including inactive)
export async function GET(_request: NextRequest) {
  try {
    const madrasas = await prisma.madrasa.findMany({
      where:   { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        id:              true,
        name_bn:         true,
        registrationNo:  true,
        district:        true,
        division:        true,
        isActive:        true,
        createdAt:       true,
      },
    });

    return NextResponse.json({ data: madrasas }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/madrasas]", error);
    return NextResponse.json(
      { error: "Failed to fetch madrasas" },
      { status: 500 },
    );
  }
}

// POST — Create new madrasa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name_bn:         string;
      registrationNo:  string;
      district:        string;
      division:        string;
      establishedYear: number | null;
    };

    if (!body.name_bn?.trim()) {
      return NextResponse.json(
        { error: "নামটি আবশ্যক" },
        { status: 400 },
      );
    }
    if (!body.registrationNo?.trim()) {
      return NextResponse.json(
        { error: "রেজিস্ট্রেশন নম্বর আবশ্যক" },
        { status: 400 },
      );
    }
    if (!body.district?.trim() || !body.division?.trim()) {
      return NextResponse.json(
        { error: "জেলা ও বিভাগ আবশ্যক" },
        { status: 400 },
      );
    }

    // Check unique registrationNo
    const existing = await prisma.madrasa.findUnique({
      where: { registrationNo: body.registrationNo.trim() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "এই রেজিস্ট্রেশন নম্বর ইতিমধ্যে আছে" },
        { status: 409 },
      );
    }

    const madrasa = await prisma.madrasa.create({
      data: {
        name_bn:         body.name_bn.trim(),
        registrationNo:  body.registrationNo.trim(),
        district:        body.district.trim(),
        division:        body.division.trim(),
        establishedYear: body.establishedYear ?? null,
      },
    });

    return NextResponse.json({ data: madrasa }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/madrasas]", error);
    return NextResponse.json(
      { error: "Failed to create madrasa" },
      { status: 500 },
    );
  }
}