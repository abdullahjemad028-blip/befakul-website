"use client";

import React from "react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
      style={{ fontFamily: "var(--font-bangla)" }}
      aria-label="নোটিশ প্রিন্ট করুন"
    >
      🖨 প্রিন্ট
    </button>
  );
}