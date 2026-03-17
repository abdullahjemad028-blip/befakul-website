import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const madrasa = await prisma.madrasa.findFirst({
      where: {
        id:        params.id,
        isActive:  true,
        deletedAt: null,
      },
      select: {
        id:              true,
        name_bn:         true,
        registrationNo:  true,
        district:        true,
        division:        true,
        establishedYear: true,
        createdAt:       true,
      },
    });

    if (!madrasa) {
      return NextResponse.json(
        { error: "Madrasa not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(madrasa, { status: 200 });
  } catch (error) {
    console.error("[GET /api/madrasas/[id]]", error);
    return NextResponse.json(
      { error: "Failed to fetch madrasa" },
      { status: 500 },
    );
  }
}