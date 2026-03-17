import LogoutButton from "@/components/admin/LogoutButton";
import React from "react";
import Link from "next/link";
import NoticeActionsClient from "@/components/admin/NoticeActionsClient";
import { prisma } from "@/lib/prisma";

interface NoticeRow {
  id:          string;
  title_bn:    string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt:   Date;
  deletedAt:   Date | null;
}

function getStatus(notice: NoticeRow): {
  label: string;
  color: string;
} {
  if (notice.deletedAt !== null) {
    return { label: "আর্কাইভড",   color: "bg-gray-100 text-gray-600" };
  }
  if (notice.isPublished) {
    return { label: "প্রকাশিত",   color: "bg-green-100 text-green-700" };
  }
  return   { label: "ড্রাফট",     color: "bg-yellow-100 text-yellow-700" };
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("bn-BD", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  });
}

// Direct Prisma query — no API call needed in server component
async function getAdminNotices(): Promise<NoticeRow[]> {
  return prisma.notice.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id:          true,
      title_bn:    true,
      isPublished: true,
      publishedAt: true,
      createdAt:   true,
      deletedAt:   true,
    },
  });
}

export default async function AdminNoticesPage() {
  const notices = await getAdminNotices();

  const total     = notices.length;
  const published = notices.filter((n) => n.isPublished && !n.deletedAt).length;
  const drafts    = notices.filter((n) => !n.isPublished && !n.deletedAt).length;
  const archived  = notices.filter((n) => !!n.deletedAt).length;

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
      নোটিশ ম্যানেজমেন্ট
    </h1>
    <p className="text-sm text-gray-500 mt-1">
      মোট {total} • প্রকাশিত {published} • ড্রাফট {drafts} • আর্কাইভড {archived}
    </p>
  </div>
  <div className="flex items-center gap-3">
    <Link
      href="/admin/notices/new"
      className="px-4 py-2 text-sm font-medium text-white rounded"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      + নতুন নোটিশ
    </Link>
    <LogoutButton />
  </div>
</div>




        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {notices.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              কোনো নোটিশ নেই।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      শিরোনাম
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                      স্ট্যাটাস
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                      প্রকাশের তারিখ
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                      তৈরির তারিখ
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {notices.map((notice) => {
                    const status = getStatus(notice);
                    return (
                      <tr key={notice.id} className="hover:bg-gray-50">
                        {/* Title */}
                        <td className="px-4 py-3 max-w-xs">
                          <span
                            className="text-gray-900 font-medium line-clamp-2 leading-snug"
                            title={notice.title_bn}
                          >
                            {notice.title_bn}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        {/* Published date */}
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {formatDate(notice.publishedAt)}
                        </td>

                        {/* Created date */}
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {formatDate(notice.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <NoticeActionsClient
                            id={notice.id}
                            isPublished={notice.isPublished}
                            isArchived={!!notice.deletedAt}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}