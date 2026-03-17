import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MadrasaBulkUpload from "@/components/admin/MadrasaBulkUpload";

async function getAdminMadrasas() {
  return prisma.madrasa.findMany({
    where:   { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id:             true,
      name_bn:        true,
      registrationNo: true,
      district:       true,
      division:       true,
      isActive:       true,
    },
  });
}

export default async function AdminMadrasasPage() {
  const madrasas = await getAdminMadrasas();
  const total    = madrasas.length;
  const active   = madrasas.filter((m) => m.isActive).length;
  const inactive = total - active;

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "var(--font-bangla)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              মাদ্রাসা ম্যানেজমেন্ট
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              মোট {total} • সক্রিয় {active} • নিষ্ক্রিয় {inactive}
            </p>
          </div>
          <Link
            href="/admin/madrasas/new"
            className="px-4 py-2 text-sm font-medium text-white rounded"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            + নতুন মাদ্রাসা
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {madrasas.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              কোনো মাদ্রাসা নেই।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">নাম</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">রেজিস্ট্রেশন</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">জেলা</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">বিভাগ</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">স্ট্যাটাস</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {madrasas.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">
                        <span className="line-clamp-1">{m.name_bn}</span>
                      </td>
                      <td
                        className="px-4 py-3 text-gray-600 whitespace-nowrap"
                        style={{ fontFamily: "var(--font-english)" }}
                      >
                        {m.registrationNo}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{m.district}</td>
                      <td className="px-4 py-3 text-gray-600">{m.division}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                            m.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {m.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/madrasas/${m.id}/edit`}
                          className="text-xs font-medium px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          সম্পাদনা
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bulk Upload */}
        <div className="mt-8">
          <MadrasaBulkUpload />
        </div>

      </div>
    </div>
  );
}