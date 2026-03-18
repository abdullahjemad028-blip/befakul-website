import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategoryInfo } from "@/lib/notice-categories";
import PrintButton from "@/components/notices/PrintButton";

interface NoticeDetail {
  id: string;
  title_bn: string;
  body_bn: string;
  publishedAt: Date | null;
  isPdf: boolean;
  pdfUrl: string | null;
  category: string;
  imageUrl: string | null;
}

const SITE_NAME = "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ";

async function fetchNotice(id: string): Promise<NoticeDetail | null> {
  try {
    return await prisma.notice.findFirst({
      where: { id, isPublished: true, deletedAt: null },
      select: {
        id:          true,
        title_bn:    true,
        body_bn:     true,
        publishedAt: true,
        isPdf:       true,
        pdfUrl:      true,
        category:    true,   // ← এটা missing ছিল
        imageUrl:    true,   // ← এটা missing ছিল
      },
    });
  } catch {
    return null;
  }
}

function formatDateBangla(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + "...";
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const notice = await fetchNotice(params.id);
  if (!notice) return { title: `নোটিশ পাওয়া যায়নি | ${SITE_NAME}` };
  return {
    title: `${notice.title_bn} | ${SITE_NAME}`,
    description: truncate(notice.body_bn, 140),
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const notice = await fetchNotice(params.id);
  if (!notice) notFound();

  const catInfo = getCategoryInfo(notice.category);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-bangla)" }}>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-full { max-width: 100% !important; padding: 0 !important; }
          body { font-size: 14pt; }
          h1 { font-size: 18pt; }
        }
      `}</style>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 print-full">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-6 no-print">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:underline">
                হোম
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link href="/notices" className="hover:underline">
                নোটিশ বোর্ড
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li
              className="text-gray-700 font-medium truncate max-w-xs"
              aria-current="page"
            >
              {notice.title_bn}
            </li>
          </ol>
        </nav>

        {/* Notice Article */}
        <article
          className="border border-gray-200 rounded-lg overflow-hidden"
          aria-labelledby="notice-title"
        >
          {/* Header */}
          <div
            className="px-6 py-5 md:px-10 border-b border-gray-200"
            style={{ backgroundColor: "var(--color-bg-section)" }}
          >
            {/* Print header — only shows when printing */}
            <div className="hidden print:block mb-4 pb-4 border-b border-gray-300">
              <p className="text-lg font-bold">বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ</p>
              <p className="text-sm text-gray-500">অফিসিয়াল নোটিশ</p>
            </div>

            {/* Category badge */}
            <span
              className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mb-3 ${catInfo.color}`}
            >
              {catInfo.label}
            </span>

            {/* Title */}
            <h1
              id="notice-title"
              className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3"
            >
              {notice.title_bn}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <time
                dateTime={String(notice.publishedAt)}
                className="text-sm text-gray-500"
              >
                প্রকাশিত: {formatDateBangla(notice.publishedAt)}
              </time>

              {/* Action buttons */}
              <div className="flex items-center gap-2 no-print">
                {/* Print button */}
                <PrintButton />

                {/* PDF button — সংশোধিত */}
                {notice.isPdf && notice.pdfUrl && (
                  <a
                    href={notice.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white rounded"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    PDF ডাউনলোড ↓
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 md:px-10">
            {/* Image — if exists */}
            {notice.imageUrl && (
              <div className="mb-6">
                <div
                  className="relative w-full rounded overflow-hidden border border-gray-200"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src={notice.imageUrl}
                    alt={notice.title_bn}
                    fill
                    className="object-cover"
                    unoptimized // External URL — skip Next.js optimization
                  />
                </div>
              </div>
            )}

            {/* Body text */}
            <div
              className="text-base text-gray-800 leading-loose whitespace-pre-wrap"
              style={{ fontFamily: "var(--font-bangla)" }}
            >
              {notice.body_bn}
            </div>

            {/* PDF download at bottom too — সংশোধিত */}
            {notice.isPdf && notice.pdfUrl && (
              <div className="mt-8 pt-6 border-t border-gray-200 no-print">
                <a
                  href={notice.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded text-base font-medium text-white"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  PDF ডাউনলোড করুন ↓
                </a>
              </div>
            )}
          </div>
        </article>

        {/* Back */}
        <div className="mt-8 no-print">
          <Link
            href="/notices"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            ← নোটিশ বোর্ডে ফিরুন
          </Link>
        </div>
      </main>
    </div>
  );
}