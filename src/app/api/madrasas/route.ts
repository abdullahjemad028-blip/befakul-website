import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // ✅ Safe parsing (NO NaN issue)
    const rawPage = searchParams.get("page");
    const rawLimit = searchParams.get("limit");

    const page =
      rawPage && !isNaN(Number(rawPage)) && Number(rawPage) > 0
        ? Number(rawPage)
        : DEFAULT_PAGE;

    const limit =
      rawLimit && !isNaN(Number(rawLimit)) && Number(rawLimit) > 0
        ? Math.min(Number(rawLimit), MAX_LIMIT)
        : DEFAULT_LIMIT;

    const search = searchParams.get("search")?.trim() ?? "";
    const division = searchParams.get("division")?.trim() ?? "";
    const district = searchParams.get("district")?.trim() ?? "";

    const skip = (page - 1) * limit;

    // ✅ Safe where clause
    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        {
          name_bn: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          registrationNo: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (division) {
      where.division = division;
    }

    if (district) {
      where.district = district;
    }

    // ✅ DB query (parallel)
    const [total, madrasas] = await Promise.all([
      prisma.madrasa.count({ where }),
      prisma.madrasa.findMany({
        where,
        orderBy: { name_bn: "asc" },
        skip,
        take: limit,
        select: {
          id: true,
          name_bn: true,
          registrationNo: true,
          district: true,
          division: true,
          establishedYear: true,
        },
      }),
    ]);

    return NextResponse.json(
      {
        data: madrasas,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ API ERROR (/api/madrasas):", error);

    return NextResponse.json(
      {
        error: "Failed to fetch madrasas",
      },
      { status: 500 }
    );
  }
}