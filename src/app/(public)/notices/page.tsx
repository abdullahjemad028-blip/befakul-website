export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCategoryInfo } from "@/lib/notice-categories";
import NoticeSearchFilter from "@/components/notices/NoticeSearchFilter";

export const metadata: Metadata = {
  title: "নোটিশ বোর্ড | বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  description:
    "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের সকল নোটিশ, পরিপত্র ও বিজ্ঞপ্তি।",
};

type SearchParams = { [key: string]: string | string[] | undefined };

const LIMIT = 10;

async function fetchNotices(params: SearchParams) {
  try {
    const page = Math.max(1, parseInt(String(params.page ?? "1"), 10) || 1);
    const search = String(params.search ?? "").trim();
    const category = String(params.category ?? "").trim();
    const skip = (page - 1) * LIMIT;

    const where = {
      isPublished: true,
      deletedAt: null,
      publishedAt: { lte: new Date() },
      ...(search && {
        title_bn: { contains: search, mode: "insensitive" as const },
      }),
      ...(category && { category }), // ✅ এখানে 'as never' সরিয়ে শুধু category দেওয়া হয়েছে
    };

    const [total, notices] = await Promise.all([
      prisma.notice.count({ where }),
      prisma.notice.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: LIMIT,
        select: {
          id: true,
          title_bn: true,
          publishedAt: true,
          isPdf: true,
          pdfUrl: true,
          category: true,
          imageUrl: true,
        },
      }),
    ]);

    return {
      data: notices,
      meta: { page, limit: LIMIT, total, totalPages: Math.ceil(total / LIMIT) },
    };
  } catch {
    return null;
  }
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NoticesPage(props: { searchParams: SearchParams }) {
  const { searchParams } = props;
  const response = await fetchNotices(searchParams);
  const currentPage = Math.max(1, parseInt(String(searchParams.page ?? "1"), 10) || 1);
  const currentSearch = String(searchParams.search ?? "");
  const currentCategory = String(searchParams.category ?? "");

  function buildPageUrl(page: number): string {
    const p = new URLSearchParams();
    p.set("page", String(page));
    if (currentSearch) p.set("search", currentSearch);
    if (currentCategory) p.set("category", currentCategory);
    return `/notices?${p.toString()}`;
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-bangla)" }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:underline">
                হোম
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-gray-800 font-medium" aria-current="page">
              নোটিশ বোর্ড
            </li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">নোটিশ বোর্ড</h1>
          <p className="text-base text-gray-600 mt-2">
            সকল সরকারি নোটিশ, পরিপত্র ও বিজ্ঞপ্তি।
          </p>
        </div>

        {/* Search + Filter */}
        <Suspense fallback={null}>
          <NoticeSearchFilter />
        </Suspense>

        {/* Error */}
        {response === null && (
          <div className="py-16 text-center">
            <p className="text-gray-500">তথ্য লোড করা সম্ভব হয়নি।</p>
          </div>
        )}

        {/* Empty */}
        {response !== null && response.data.length === 0 && (
          <div className="py-16 text-center border border-gray-200 rounded">
            <p className="text-gray-500">কোনো নোটিশ পাওয়া যায়নি।</p>
          </div>
        )}

        {/* List */}
        {response !== null && response.data.length > 0 && (
          <section aria-labelledby="notices-heading">
            <h2 id="notices-heading" className="sr-only">
              নোটিশ তালিকা
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              মোট{" "}
              <span className="font-semibold text-gray-700">
                {response.meta.total}
              </span>
              টি নোটিশ
            </p>

            <ul
              className="divide-y divide-gray-200 border border-gray-200 rounded"
              role="list"
            >
              {response.data.map((notice) => {
                const catInfo = getCategoryInfo(notice.category);
                const isExternal = !!(notice.isPdf && notice.pdfUrl);
                const href = isExternal
                  ? (notice.pdfUrl as string)
                  : `/notices/${notice.id}`;

                return (
                  <li key={notice.id}>
                    <article className="flex items-start justify-between gap-3 px-4 py-4 hover:bg-gray-50 transition-colors duration-100">
                      <div className="flex-1 min-w-0">
                        {/* Category badge */}
                        <span
                          className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mb-1.5 ${catInfo.color}`}
                          style={{ fontFamily: "var(--font-bangla)" }}
                        >
                          {catInfo.label}
                        </span>

                        {/* Title - সংশোধিত অংশ শুরু */}
                        {isExternal ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-medium text-gray-800 hover:underline leading-snug block"
                          >
                            {notice.title_bn}
                          </a>
                        ) : (
                          <Link
                            href={href}
                            className="text-base font-medium text-gray-800 hover:underline leading-snug block"
                          >
                            {notice.title_bn}
                          </Link>
                        )}
                        {/* সংশোধিত অংশ শেষ */}

                        {/* Date */}
                        <time
                          dateTime={String(notice.publishedAt)}
                          className="text-sm text-gray-500 mt-1 block"
                        >
                          {notice.publishedAt ? formatDate(notice.publishedAt) : "—"}
                        </time>
                      </div>

                      {/* PDF badge */}
                      {notice.isPdf && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded border shrink-0 mt-1"
                          style={{
                            color: "var(--color-primary)",
                            borderColor: "var(--color-primary)",
                          }}
                        >
                          PDF
                        </span>
                      )}
                    </article>
                  </li>
                );
              })}
            </ul>

            {/* Pagination */}
            {response.meta.totalPages > 1 && (
              <nav
                className="mt-8 flex items-center justify-between"
                aria-label="পেজিনেশন"
              >
                {currentPage > 1 ? (
                  <Link
                    href={buildPageUrl(currentPage - 1)}
                    className="px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    ← পূর্ববর্তী
                  </Link>
                ) : (
                  <span className="px-4 py-2 text-sm rounded border border-gray-200 text-gray-300 cursor-not-allowed">
                    ← পূর্ববর্তী
                  </span>
                )}

                <span className="text-sm text-gray-600">
                  পৃষ্ঠা{" "}
                  <span className="font-semibold">{currentPage}</span> /{" "}
                  <span className="font-semibold">{response.meta.totalPages}</span>
                </span>

                {currentPage < response.meta.totalPages ? (
                  <Link
                    href={buildPageUrl(currentPage + 1)}
                    className="px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    পরবর্তী →
                  </Link>
                ) : (
                  <span className="px-4 py-2 text-sm rounded border border-gray-200 text-gray-300 cursor-not-allowed">
                    পরবর্তী →
                  </span>
                )}
              </nav>
            )}
          </section>
        )}
      </main>
    </div>
  );
}