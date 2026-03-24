export const dynamic = "force-dynamic";
import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Fetch latest 6 published notices directly from DB
// No API call needed — this is a Server Component
async function getLatestNotices() {
  return prisma.notice.findMany({
    where: {
      isPublished: true,
      deletedAt:   null,
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: "desc" },
    take: 6,
    select: {
      id:          true,
      title_bn:    true,
      publishedAt: true,
      isPdf:       true,
      pdfUrl:      true,
      category:    true,
      imageUrl:    true,
    },
  });
}
function formatDateBangla(date: Date): string {
  return new Date(date).toLocaleDateString("bn-BD", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  });
}

export default async function NoticeBoardSection() {
  const notices = await getLatestNotices();

  return (
    <section
      className="w-full py-12 md:py-16 bg-white"
      aria-labelledby="notice-board-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            id="notice-board-heading"
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            নোটিশ বোর্ড
          </h2>

          <Link
            href="/notices"
            className="text-sm font-medium underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
            style={{
              color:        "var(--color-primary)",
              outlineColor: "var(--color-primary)",
              fontFamily:   "var(--font-bangla)",
            }}
          >
            বেফাক নোটিশ বোর্ড →
          </Link>
        </div>

        {/* Empty State */}
        {notices.length === 0 && (
          <div className="border border-gray-200 rounded px-4 py-10 text-center">
            <p
              className="text-gray-500 text-base"
              style={{ fontFamily: "var(--font-bangla)" }}
            >
              এই মুহূর্তে কোনো প্রকাশিত নোটিশ নেই।
            </p>
          </div>
        )}

        {/* Notice List */}
        {notices.length > 0 && (
          <ul
            className="divide-y divide-gray-200 border border-gray-200 rounded"
            role="list"
          >
            {notices.map((notice) => {
              const isExternal = !!(notice.isPdf && notice.pdfUrl);
              const href = isExternal
                ? (notice.pdfUrl as string)
                : `/notices/${notice.id}`;

              return (
                <li key={notice.id}>
                  <div className="flex items-start justify-between gap-4 px-4 py-4 hover:bg-gray-50 transition-colors duration-100">

                    {/* Date */}
                    <span
                      className="text-sm text-gray-500 whitespace-nowrap shrink-0 mt-0.5"
                      style={{ fontFamily: "var(--font-bangla)" }}
                    >
                      {notice.publishedAt
                        ? formatDateBangla(notice.publishedAt)
                        : "—"}
                    </span>

                    {/* Title */}
                    <span className="flex-1 min-w-0">
                      {isExternal ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base text-gray-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded leading-snug block"
                          style={{
                            outlineColor: "var(--color-primary)",
                            fontFamily:   "var(--font-bangla)",
                          }}
                        >
                          {notice.title_bn}
                          <span className="sr-only">(নতুন ট্যাবে খুলবে)</span>
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="text-base text-gray-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded leading-snug block"
                          style={{
                            outlineColor: "var(--color-primary)",
                            fontFamily:   "var(--font-bangla)",
                          }}
                        >
                          {notice.title_bn}
                        </Link>
                      )}
                    </span>

                    {/* PDF Badge */}
                    {notice.isPdf && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded border shrink-0 mt-0.5"
                        style={{
                          color:       "var(--color-primary)",
                          borderColor: "var(--color-primary)",
                          fontFamily:  "var(--font-english)",
                        }}
                        aria-label="PDF ফাইল"
                      >
                        PDF
                      </span>
                    )}

                  </div>
                </li>
              );
            })}
          </ul>
        )}

      </div>
    </section>
  );
}