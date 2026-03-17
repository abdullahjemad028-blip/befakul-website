import React from "react";
import Link from "next/link";
import MadrasaForm from "@/components/admin/MadrasaForm";

export default function NewMadrasaPage() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "var(--font-bangla)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link
            href="/admin/madrasas"
            className="text-sm hover:underline mb-3 inline-block"
            style={{ color: "var(--color-primary)" }}
          >
            {"← মাদ্রাসা তালিকায় ফিরুন"}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">নতুন মাদ্রাসা যোগ করুন</h1>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-8">
          <MadrasaForm />
        </div>
      </div>
    </div>
  );
}