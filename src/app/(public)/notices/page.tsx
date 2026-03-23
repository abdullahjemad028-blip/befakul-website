export const dynamic = "force-dynamic";

import React, { Suspense, cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NoticeCategory } from "@prisma/client";
import { getCategoryInfo } from "@/lib/notice-categories";
import NoticeSearchFilter from "@/components/notices/NoticeSearchFilter";

// ── SEO ───────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "নোটিশ বোর্ড | বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  description:
    "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের সকল নোটিশ, পরিপত্র ও বিজ্ঞপ্তি।",
};

// ── Constants ─────────────────────────────────────────────────
const LIMIT = 10;

// ── Types ─────────────────────────────────────────────────────
type SearchParams = Record<string, string | string[] | undefined>;

// ── Pure Data Fetching (cached per request) ──────────────────
const getNotices = cache(async (params: SearchParams) => {
  const page = Math.max(1, parseInt(String(params.page ?? "1"), 10) || 1);
  const search = String(params.search ?? "").trim();
  const category = String(params.category ?? "").trim();
  const skip = (page - 1) * LIMIT;

  const validCategories = Object.values(NoticeCategory);
  const categoryFilter = validCategories.includes(category as NoticeCategory)
    ? (category as NoticeCategory)
    : undefined;

  const where = {
    isPublished: true,
    deletedAt: null,
    publishedAt: { lte: new Date() },
    ...(search && {
      title_bn: { contains: search, mode: "insensitive" as const },
    }),
    ...(categoryFilter && { category: categoryFilter }),
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
    meta: {
      page,
      limit: LIMIT,
      total,
      totalPages: Math.ceil(total / LIMIT),
    },
  };
});

// ── Pure Formatting Helpers ──────────────────────────────────
function formatDate(date: Date | string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Presentational Components ────────────────────────────────
function NoticeItem({ notice }: { notice: Awaited<ReturnType<typeof getNotices>>["data"][0] }) {
  const catInfo = getCategoryInfo(notice.category);
  const isExternal = !!(notice.isPdf && notice.pdfUrl);
  const href = isExternal ? notice.pdfUrl! : `/notices/${notice.id}`;

  const linkProps = isExternal
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <li>
      <article className="flex items-start justify-between gap-3 px-4 py-4 hover:bg-gray-50 transition-colors duration-100">
        <div className="flex-1 min-w-0">
          <span
            className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mb-1.5 ${catInfo.color}`}
          >
            {catInfo.label}
          </span>

          <Link
            {...linkProps}
            className="text-base font-medium text-gray-800 hover:underline leading-snug block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
            style={{ outlineColor: "var(--color-primary)" }}
          >
            {notice.title_bn}
            {isExternal && <span className="sr-only">(নতুন ট্যাবে খুলবে)</span>}
          </Link>

          <time
            dateTime={String(notice.publishedAt)}
            className="text-sm text-gray-500 mt-1 block"
          >
            {formatDate(notice.publishedAt)}
          </time>
        </div>

        {notice.isPdf && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded border shrink-0 mt-1"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              fontFamily: "var(--font-english)",
            }}
            aria-label="PDF ফাইল"
          >
            PDF
          </span>
        )}
      </article>
    </li>
  );
}

function Pagination({
  currentPage,
  totalPages,
  buildPageUrl,
}: {
  currentPage: number;
  totalPages: number;
  buildPageUrl: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-8 flex items-center justify-between"
      aria-label="পেজিনেশন নেভিগেশন"
    >
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          style={{ outlineColor: "var(--color-primary)" }}
        >
          {"← পূর্ববর্তী"}
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm rounded border border-gray-200 text-gray-300 cursor-not-allowed">
          {"← পূর্ববর্তী"}
        </span>
      )}

      <span className="text-sm text-gray-600">
        {"পৃষ্ঠা "}
        <span className="font-semibold">{currentPage}</span>
        {" / "}
        <span className="font-semibold">{totalPages}</span>
      </span>

      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          style={{ outlineColor: "var(--color-primary)" }}
        >
          {"পরবর্তী →"}
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm rounded border border-gray-200 text-gray-300 cursor-not-allowed">
          {"পরবর্তী →"}
        </span>
      )}
    </nav>
  );
}

// ── Page Component ───────────────────────────────────────────
export default async function NoticesPage(props: { searchParams: SearchParams }) {
  const { searchParams } = props;

  // Fetch data (cached)
  const response = await getNotices(searchParams);

  // Helper to build pagination URLs
  const buildPageUrl = (page: number): string => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    if (searchParams.search) p.set("search", String(searchParams.search));
    if (searchParams.category) p.set("category", String(searchParams.category));
    return `/notices?${p.toString()}`;
  };

  const currentPage = response.meta.page;
  const totalPages = response.meta.totalPages;

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
            <li aria-hidden="true">{"›"}</li>
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

        {/* Result count */}
        <p className="text-sm text-gray-500 mb-4">
          মোট{" "}
          <span className="font-semibold text-gray-700">{response.meta.total}</span>
          টি নোটিশ
        </p>

        {/* Notice list */}
        {response.data.length === 0 ? (
          <div className="py-16 text-center border border-gray-200 rounded">
            <p className="text-gray-500">কোনো নোটিশ পাওয়া যায়নি।</p>
          </div>
        ) : (
          <section aria-labelledby="notices-heading">
            <h2 id="notices-heading" className="sr-only">
              নোটিশ তালিকা
            </h2>

            <ul className="divide-y divide-gray-200 border border-gray-200 rounded" role="list">
              {response.data.map((notice) => (
                <NoticeItem key={notice.id} notice={notice} />
              ))}
            </ul>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              buildPageUrl={buildPageUrl}
            />
          </section>
        )}
      </main>
    </div>
  );
}