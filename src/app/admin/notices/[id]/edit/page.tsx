import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import NoticeForm from "@/components/admin/NoticeForm";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: { id: string };
}

export default async function EditNoticePage({ params }: PageProps) {
  const notice = await prisma.notice.findFirst({
    where: {
      id:        params.id,
      deletedAt: null,
    },
    select: {
      id:       true,
      title_bn: true,
      body_bn:  true,
      isPdf:    true,
      pdfUrl:   true,
      category: true,   // ← যোগ করা হয়েছে
      imageUrl: true,   // ← যোগ করা হয়েছে
    },
  });

  if (!notice) notFound();

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "var(--font-bangla)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/notices"
            className="text-sm hover:underline mb-3 inline-block"
            style={{ color: "var(--color-primary)" }}
          >
            {"← নোটিশ তালিকায় ফিরুন"}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">নোটিশ সম্পাদনা</h1>
        </div>

        {/* Form pre-filled with existing data */}
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-8">
          <NoticeForm
            initialData={{
              id:       notice.id,
              title_bn: notice.title_bn,
              body_bn:  notice.body_bn,
              isPdf:    notice.isPdf,
              pdfUrl:   notice.pdfUrl ?? "",
              category: notice.category ?? "GENERAL",   // ← যোগ করা হয়েছে
              imageUrl: notice.imageUrl ?? "",           // ← যোগ করা হয়েছে
            }}
          />
        </div>

      </div>
    </div>
  );
}