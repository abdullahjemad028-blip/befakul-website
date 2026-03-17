import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { DIVISIONS, getDistrictsByDivision } from "@/lib/bangladesh-geo";

// ── Types ─────────────────────────────────────────────────────
interface ExcelRow {
  name_bn:         string;
  registrationNo:  string;
  district:        string;
  division:        string;
  establishedYear?: number | string | null;
}

interface RowResult {
  row:            number;
  name_bn:        string;
  registrationNo: string;
  status:         "success" | "skipped" | "error";
  reason?:        string;
}

// ── POST /api/admin/madrasas/bulk ─────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file     = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "কোনো ফাইল পাওয়া যায়নি" },
        { status: 400 },
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      return NextResponse.json(
        { error: "শুধুমাত্র .xlsx বা .xls ফাইল গ্রহণযোগ্য" },
        { status: 400 },
      );
    }

    // Read file buffer
    const buffer    = await file.arrayBuffer();
    const workbook  = XLSX.read(buffer, { type: "buffer" });

    // Use first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json(
        { error: "Excel ফাইলে কোনো sheet পাওয়া যায়নি" },
        { status: 400 },
      );
    }

    const sheet = workbook.Sheets[sheetName];
    const rows  = XLSX.utils.sheet_to_json<ExcelRow>(sheet, {
      defval: "",
    });

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Excel ফাইলে কোনো ডাটা পাওয়া যায়নি" },
        { status: 400 },
      );
    }

    if (rows.length > 20000) {
      return NextResponse.json(
        { error: "একবারে সর্বোচ্চ ২০,০০০ রেকর্ড আপলোড করা যাবে" },
        { status: 400 },
      );
    }

    // Valid divisions for quick lookup
    const validDivisions = new Set<string>(DIVISIONS);

    // Process each row
    const results: RowResult[] = [];
    let   successCount = 0;
    let   skippedCount = 0;
    let   errorCount   = 0;

    for (let i = 0; i < rows.length; i++) {
      const row    = rows[i];
      const rowNum = i + 2; // +2 because row 1 is header

      const name_bn        = String(row.name_bn        ?? "").trim();
      const registrationNo = String(row.registrationNo ?? "").trim();
      const district       = String(row.district       ?? "").trim();
      const division       = String(row.division       ?? "").trim();

      // ── Validate required fields ──────────────────────────
      if (!name_bn) {
        results.push({
          row: rowNum, name_bn: "(খালি)", registrationNo,
          status: "error", reason: "name_bn খালি",
        });
        errorCount++;
        continue;
      }

      if (!registrationNo) {
        results.push({
          row: rowNum, name_bn, registrationNo: "(খালি)",
          status: "error", reason: "registrationNo খালি",
        });
        errorCount++;
        continue;
      }

      if (!division || !validDivisions.has(division)) {
        results.push({
          row: rowNum, name_bn, registrationNo,
          status: "error",
          reason: `বিভাগ "${division}" সঠিক নয়`,
        });
        errorCount++;
        continue;
      }

      if (!district) {
        results.push({
          row: rowNum, name_bn, registrationNo,
          status: "error", reason: "জেলা খালি",
        });
        errorCount++;
        continue;
      }

      const validDistricts = getDistrictsByDivision(division);
      if (!validDistricts.includes(district)) {
        results.push({
          row: rowNum, name_bn, registrationNo,
          status: "error",
          reason: `জেলা "${district}" "${division}" বিভাগের অন্তর্গত নয়`,
        });
        errorCount++;
        continue;
      }

      // Parse establishedYear
      let establishedYear: number | null = null;
      if (row.establishedYear) {
        const yr = parseInt(String(row.establishedYear), 10);
        if (!isNaN(yr) && yr >= 1800 && yr <= new Date().getFullYear()) {
          establishedYear = yr;
        }
      }

      // ── Upsert — skip if registrationNo already exists ───
      try {
        const existing = await prisma.madrasa.findUnique({
          where: { registrationNo },
        });

        if (existing) {
          results.push({
            row: rowNum, name_bn, registrationNo,
            status: "skipped",
            reason: "রেজিস্ট্রেশন নম্বর ইতিমধ্যে আছে",
          });
          skippedCount++;
          continue;
        }

        await prisma.madrasa.create({
          data: {
            name_bn,
            registrationNo,
            district,
            division,
            establishedYear,
            isActive: true,
          },
        });

        results.push({
          row: rowNum, name_bn, registrationNo,
          status: "success",
        });
        successCount++;

      } catch {
        results.push({
          row: rowNum, name_bn, registrationNo,
          status: "error", reason: "Database error",
        });
        errorCount++;
      }
    }

    return NextResponse.json(
      {
        summary: {
          total:   rows.length,
          success: successCount,
          skipped: skippedCount,
          errors:  errorCount,
        },
        // Only return first 100 results to keep response small
        results: results.slice(0, 100),
        hasMore: results.length > 100,
      },
      { status: 200 },
    );

  } catch (error) {
    console.error("[POST /api/admin/madrasas/bulk]", error);
    return NextResponse.json(
      { error: "ফাইল প্রক্রিয়া করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}