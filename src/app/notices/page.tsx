import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

interface Notice {
  id: string;
  title_bn: string;
  publishedAt: string;
  isPdf: boolean;
  pdfUrl: string | null;
}

interface NoticesMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface NoticesResponse {
  data: Notice[];
  meta: NoticesMeta;
}

export const metadata: Metadata = {
  title: "নোটিশ বোর্ড | বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  description:
    "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের সকল সরকারি নোটিশ ও বিজ্ঞপ্তি।",
};

const LIMIT = 10;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

async function fetchNotices(page: number): Promise<NoticesResponse | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/notices?page=${page}&limit=${LIMIT}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as NoticesResponse;
  } catch {
    return null;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function NoticesPage(props: {
  searchParams: SearchParams;
}) {
  const rawPage = props.searchParams.page;
  const pageStr = Array.isArray(rawPage) ? rawPage[0] : (rawPage ?? "1");
  const currentPage = Math.max(1, parseInt(pageStr, 10) || 1);
  const response = await fetchNotices(currentPage);

  return (
    <div className="min-h-screen bg-white">
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14"
        style={{ fontFamily: "var(--font-bangla)" }}
      >
        {/* Breadcrumb + Heading */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link
                  href="/"
                  className="hover:underline"
                >
                  হোম
                </Link>
              </li>
              <li aria-hidden="true">{"›"}</li>
              <li className="text-gray-800 font-medium">নোটিশ বোর্ড</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">নোটিশ বোর্ড</h1>
        </div>

        {/* Error State */}
        {response === null && (
          <section className="py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              তথ্য লোড করা সম্ভব হয়নি
            </h2>
            <p className="text-gray-500">
              দয়া করে কিছুক্ষণ পরে আবার চেষ্টা করুন।
            </p>
          </section>
        )}

        {/* Empty State */}
        {response !== null && response.data.length === 0 && (
          <section className="py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              কোনো নোটিশ পাওয়া যায়নি
            </h2>
            <p className="text-gray-500">
              এই মুহূর্তে কোনো প্রকাশিত নোটিশ নেই।
            </p>
          </section>
        )}

        {/* Notice List */}
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
                const isExternal = !!(notice.isPdf && notice.pdfUrl);
                const href = isExternal
                  ? (notice.pdfUrl as string)
                  : `/notices/${notice.id}`;

                return (
                  <li key={notice.id}>
                    <article className="flex items-start justify-between gap-4 px-4 py-4 hover:bg-gray-50">



                        <div className="flex-1 min-w-0">
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

  <time
    dateTime={notice.publishedAt}
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
                    href={`/notices?page=${currentPage - 1}`}
                    className="px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
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
                  <span className="font-semibold">
                    {response.meta.totalPages}
                  </span>
                </span>

                {currentPage < response.meta.totalPages ? (
                  <Link
                    href={`/notices?page=${currentPage + 1}`}
                    className="px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {"পরবর্তী →"}
                  </Link>
                ) : (
                  <span className="px-4 py-2 text-sm rounded border border-gray-200 text-gray-300 cursor-not-allowed">
                    {"পরবর্তী →"}
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