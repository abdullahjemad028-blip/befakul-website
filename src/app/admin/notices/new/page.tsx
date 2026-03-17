import React from "react";
import Link from "next/link";
import NoticeForm from "@/components/admin/NoticeForm";

export default function NewNoticePage() {
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
          <h1 className="text-2xl font-bold text-gray-900">নতুন নোটিশ তৈরি</h1>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-8">
          <NoticeForm />
        </div>

      </div>
    </div>
  );
}