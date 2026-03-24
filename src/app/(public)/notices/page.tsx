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

// ── PDF Icon SVG ─────────────────────────────────────────────
function PdfIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 1.5A1.5 1.5 0 0 1 5.5 0h5.086a1.5 1.5 0 0 1 1.06.44l2.415 2.414A1.5 1.5 0 0 1 14.5 3.914V14.5A1.5 1.5 0 0 1 13 16H5.5A1.5 1.5 0 0 1 4 14.5V1.5Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M10.5 0v3a1 1 0 0 0 1 1h3"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <text
        x="8"
        y="12"
        textAnchor="middle"
        fontSize="5"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
      >
        PDF
      </text>
    </svg>
  );
}

// ── Notice Item ───────────────────────────────────────────────
function NoticeItem({
  notice,
}: {
  notice: Awaited<ReturnType<typeof getNotices>>["data"][0];
}) {
  const catInfo = getCategoryInfo(notice.category);
  const isExternal = !!(notice.isPdf && notice.pdfUrl);
  const href = isExternal ? notice.pdfUrl! : `/notices/${notice.id}`;

  const linkProps = isExternal
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  /*
   * Left accent bar color is driven by catInfo.color which already contains
   * Tailwind border/text/bg classes such as "border-green-600 text-green-700
   * bg-green-50". We derive the accent from the border colour by mapping the
   * category.  A tiny inline style is the safest approach so Tailwind's JIT
   * doesn't purge dynamic class strings.
   */
  const accentStyle = getCategoryAccentStyle(notice.category);

  return (
    <li className="relative">
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
        style={accentStyle}
        aria-hidden="true"
      />

      <article
        className="
          flex items-start justify-between gap-3
          pl-5 pr-4 py-4
          hover:bg-stone-50
          transition-colors duration-150
          min-h-[44px]
        "
      >
        {/* ── Left content ── */}
        <div className="flex-1 min-w-0">
          {/* Category pill */}
          <span
            className={`
              inline-block text-[11px] font-semibold tracking-wide
              px-2 py-0.5 rounded-full border mb-1.5
              ${catInfo.color}
            `}
          >
            {catInfo.label}
          </span>

          {/* Title */}
          <Link
            {...linkProps}
            className="
              block leading-[1.75] font-semibold text-gray-800
              text-[0.9375rem] sm:text-base
              line-clamp-2 sm:line-clamp-none
              hover:text-[color:var(--color-primary)] hover:underline
              focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 rounded-sm
            "
            style={{ outlineColor: "var(--color-primary)" }}
          >
            {notice.title_bn}
            {isExternal && (
              <span className="sr-only"> (অফিসিয়াল PDF — নতুন ট্যাবে খুলবে)</span>
            )}
          </Link>

          {/* Date + PDF badge row (single line on mobile) */}
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <time
              dateTime={String(notice.publishedAt)}
              className="text-[0.8125rem] text-gray-400 leading-tight"
              style={{ fontFamily: "var(--font-english), var(--font-bangla)" }}
            >
              {formatDate(notice.publishedAt)}
            </time>

            {/* PDF badge — visible inline on mobile */}
            {notice.isPdf && (
              <span
                className="
                  sm:hidden
                  inline-flex items-center gap-1
                  text-[11px] font-semibold px-1.5 py-0.5 rounded border
                "
                style={{
                  color: "var(--color-primary)",
                  borderColor: "var(--color-primary)",
                  fontFamily: "var(--font-english)",
                }}
                aria-label="PDF ফাইল"
              >
                <PdfIcon className="w-3.5 h-3.5" />
                PDF
              </span>
            )}
          </div>
        </div>

        {/* ── Right: PDF badge (desktop) ── */}
        {notice.isPdf && (
          <span
            className="
              hidden sm:inline-flex items-center gap-1.5
              text-[11px] font-semibold px-2 py-1 rounded border shrink-0 mt-0.5
            "
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              fontFamily: "var(--font-english)",
            }}
            aria-label="PDF ফাইল"
          >
            <PdfIcon className="w-3.5 h-3.5" />
            PDF
          </span>
        )}
      </article>
    </li>
  );
}

// ── Category → accent color mapping ─────────────────────────
function getCategoryAccentStyle(
  category: NoticeCategory
): React.CSSProperties {
  const map: Record<string, string> = {
    GENERAL: "#6b7280",       // gray-500
    EXAM: "#2563eb",          // blue-600
    ADMISSION: "#16a34a",     // green-600
    SCHOLARSHIP: "#d97706",   // amber-600
    CIRCULAR: "#7c3aed",      // violet-600
    RESULT: "#0891b2",        // cyan-600
    EVENT: "#db2777",         // pink-600
    URGENT: "#dc2626",        // red-600
  };
  return {
    backgroundColor: map[category] ?? "var(--color-primary)",
  };
}

// ── Pagination ────────────────────────────────────────────────
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

  const btnBase =
    "inline-flex items-center px-4 py-2 text-sm font-medium rounded border transition-colors duration-100";
  const btnActive =
    "border-gray-300 text-gray-700 hover:bg-stone-50 hover:border-gray-400";
  const btnDisabled =
    "border-gray-200 text-gray-300 cursor-not-allowed select-none";

  return (
    <nav
      className="mt-8 flex items-center justify-between gap-4"
      aria-label="পেজিনেশন নেভিগেশন"
    >
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className={`${btnBase} ${btnActive}`}
          aria-label="পূর্ববর্তী পৃষ্ঠা"
        >
          ← পূর্ববর্তী
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">
          ← পূর্ববর্তী
        </span>
      )}

      <span
        className="text-sm text-gray-500 tabular-nums"
        style={{ fontFamily: "var(--font-english)" }}
        aria-live="polite"
        aria-atomic="true"
      >
        পৃষ্ঠা{" "}
        <strong className="text-gray-800 font-semibold">{currentPage}</strong>
        {" / "}
        <strong className="text-gray-800 font-semibold">{totalPages}</strong>
      </span>

      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className={`${btnBase} ${btnActive}`}
          aria-label="পরবর্তী পৃষ্ঠা"
        >
          পরবর্তী →
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">
          পরবর্তী →
        </span>
      )}
    </nav>
  );
}

// ── Empty State ───────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      className="
        py-16 text-center border border-gray-200 rounded-sm
        bg-stone-50/60
      "
      role="status"
      aria-live="polite"
    >
      {/* Document icon */}
      <svg
        className="mx-auto mb-4 w-10 h-10 text-gray-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1
             2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414A1 1 0 0 1
             19 9.414V19a2 2 0 0 1-2 2Z"
        />
      </svg>
      <p className="text-gray-500 text-sm leading-relaxed">
        এই মুহূর্তে কোনো নোটিশ পাওয়া যাচ্ছে না।
      </p>
      <p className="text-gray-400 text-xs mt-1">
        অনুগ্রহ করে পরে আবার চেষ্টা করুন।
      </p>
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────
function GazetteDivider() {
  return (
    <div className="flex items-center gap-3 my-6" aria-hidden="true">
      <div className="flex-1 h-px bg-gray-200" />
      <svg
        className="w-4 h-4 text-gray-300 shrink-0"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <rect x="6" y="0" width="4" height="4" rx="0.5" />
        <rect x="6" y="6" width="4" height="4" rx="0.5" />
        <rect x="6" y="12" width="4" height="4" rx="0.5" />
      </svg>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ── Page Component ───────────────────────────────────────────
export default async function NoticesPage(props: {
  searchParams: SearchParams;
}) {
  const { searchParams } = props;

  const response = await getNotices(searchParams);

  const buildPageUrl = (page: number): string => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    if (searchParams.search) p.set("search", String(searchParams.search));
    if (searchParams.category)
      p.set("category", String(searchParams.category));
    return `/notices?${p.toString()}`;
  };

  const currentPage = response.meta.page;
  const totalPages = response.meta.totalPages;

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-bangla)" }}
    >
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* ── Breadcrumb (hidden on ≤ sm) ── */}
        <nav
          aria-label="breadcrumb"
          className="hidden sm:block mb-5"
        >
          <ol className="flex items-center gap-2 text-[0.8125rem] text-gray-400">
            <li>
              <Link
                href="/"
                className="hover:text-gray-600 hover:underline transition-colors"
              >
                হোম
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-300">
              ›
            </li>
            <li className="text-gray-600 font-medium" aria-current="page">
              নোটিশ বোর্ড
            </li>
          </ol>
        </nav>

        {/* ── Page Header ── */}
        <header className="mb-7 pb-5 border-b border-gray-200">
          {/* Authority stamp line */}
          <p
            className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-2"
            style={{ fontFamily: "var(--font-english), var(--font-bangla)", letterSpacing: "0.12em" }}
          >
            বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ
          </p>

          <h1
            className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight"
          >
            নোটিশ বোর্ড
          </h1>

          <p className="text-[0.9rem] text-gray-500 mt-1.5 leading-[1.7]">
            বেফাক বোর্ড কর্তৃক প্রকাশিত সকল অফিসিয়াল নোটিশ, পরিপত্র ও
            বিজ্ঞপ্তি।
          </p>
        </header>

        {/* ── Search + Filter ── */}
        <Suspense fallback={null}>
          <NoticeSearchFilter />
        </Suspense>

        <GazetteDivider />

        {/* ── Result count ── */}
        <p className="text-[0.8125rem] text-gray-400 mb-3">
          মোট{" "}
          <span
            className="font-semibold text-gray-700 tabular-nums"
            style={{ fontFamily: "var(--font-english)" }}
          >
            {response.meta.total}
          </span>
          টি নোটিশ পাওয়া গেছে
        </p>

        {/* ── Notice list ── */}
        {response.data.length === 0 ? (
          <EmptyState />
        ) : (
          <section aria-labelledby="notices-heading">
            <h2 id="notices-heading" className="sr-only">
              নোটিশ তালিকা
            </h2>

            <ul
              className="
                divide-y divide-gray-100
                border border-gray-200 rounded-sm
                overflow-hidden
                shadow-[0_1px_3px_0_rgb(0,0,0,0.04)]
              "
              role="list"
            >
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