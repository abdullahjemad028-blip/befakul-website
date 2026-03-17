import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────
interface NoticeDetail {
  id:          string;
  title_bn:    string;
  body_bn:     string;
  publishedAt: string;
  isPdf:       boolean;
  pdfUrl:      string | null;
}

interface PageProps {
  params: { id: string };
}

// ── Constants ─────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
const SITE_NAME = "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ";

// ── Data Fetching ─────────────────────────────────────────────
async function fetchNotice(id: string): Promise<NoticeDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/notices/${id}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as NoticeDetail;
  } catch {
    return null;
  }
}

// ── Helpers ───────────────────────────────────────────────────
function formatDateBangla(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("bn-BD", {
    day:     "numeric",
    month:   "long",
    year:    "numeric",
    weekday: "long",
  });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

// ── Part C — Dynamic SEO Metadata ────────────────────────────
export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const notice = await fetchNotice(params.id);

  if (!notice) {
    return {
      title: `নোটিশ পাওয়া যায়নি | ${SITE_NAME}`,
    };
  }

  return {
    title:       `${notice.title_bn} | ${SITE_NAME}`,
    description: truncateText(notice.body_bn, 140),
    openGraph: {
      title:       notice.title_bn,
      description: truncateText(notice.body_bn, 140),
      locale:      "bn_BD",
      type:        "article",
    },
  };
}

// ── Page Component ────────────────────────────────────────────
export default async function NoticeDetailPage({ params }: PageProps) {
  const notice = await fetchNotice(params.id);

  // Triggers Next.js built-in 404 page
  if (!notice) {
    notFound();
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-bangla)" }}
    >
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* ── Breadcrumb ──────────────────────────────────── */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <li>
              <Link
                href="/"
                className="hover:underline focus-visible:outline focus-visible:outline-2 rounded"
                style={{ outlineColor: "var(--color-primary)" }}
              >
                হোম
              </Link>
            </li>
            <li aria-hidden="true">{"›"}</li>
            <li>
              <Link
                href="/notices"
                className="hover:underline focus-visible:outline focus-visible:outline-2 rounded"
                style={{ outlineColor: "var(--color-primary)" }}
              >
                নোটিশ বোর্ড
              </Link>
            </li>
            <li aria-hidden="true">{"›"}</li>
            <li
              className="text-gray-700 font-medium truncate max-w-xs"
              aria-current="page"
            >
              {notice.title_bn}
            </li>
          </ol>
        </nav>

        {/* ── Notice Card ──────────────────────────────────── */}
        <article
          className="border border-gray-200 rounded-lg px-6 py-8 md:px-10 md:py-10"
          aria-labelledby="notice-title"
        >
          {/* PDF Badge */}
          {notice.isPdf && (
            <span
              className="inline-block text-xs font-semibold px-2 py-0.5 rounded border mb-4"
              style={{
                color:       "var(--color-primary)",
                borderColor: "var(--color-primary)",
              }}
            >
              PDF নোটিশ
            </span>
          )}

          {/* Title */}
          <h1
            id="notice-title"
            className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            {notice.title_bn}
          </h1>

          {/* Published Date */}
          <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
            <time
              dateTime={notice.publishedAt}
              className="text-sm text-gray-500"
              style={{ fontFamily: "var(--font-bangla)" }}
            >
              প্রকাশিত: {formatDateBangla(notice.publishedAt)}
            </time>
          </div>

          {/* Body Content */}
          <div
            className="text-base text-gray-800 leading-loose whitespace-pre-wrap"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            {notice.body_bn}
          </div>

          {/* PDF Download Button */}
          {notice.isPdf && notice.pdfUrl && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href={notice.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded text-base font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  backgroundColor: "var(--color-primary)",
                  outlineColor:    "var(--color-primary)",
                  fontFamily:      "var(--font-bangla)",
                }}
              >
                PDF ডাউনলোড করুন ↓
              </a>
            </div>
          )}
        </article>

        {/* ── Back Link ────────────────────────────────────── */}
        <div className="mt-8">
          <Link
            href="/notices"
            className="text-sm font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
            style={{
              color:        "var(--color-primary)",
              outlineColor: "var(--color-primary)",
              fontFamily:   "var(--font-bangla)",
            }}
          >
            {"← নোটিশ বোর্ডে ফিরে যান"}
          </Link>
        </div>

      </main>
    </div>
  );
}