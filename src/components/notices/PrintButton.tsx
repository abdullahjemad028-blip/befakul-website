"use client";

import React from "react";

interface Props {
  noticeId: string;
}

export default function PrintButton({ noticeId }: Props) {
  function handlePrint() {
    const printUrl    = `/notices/${noticeId}/print`;
    const printWindow = window.open(
      printUrl,
      "_blank",
      "width=794,height=1123,toolbar=0,menubar=0,location=0",
    );

    // Auto print when window loads
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  }

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        fontFamily:   "var(--font-bangla)",
        outlineColor: "var(--color-primary)",
      }}
      aria-label="নোটিশ প্রিন্ট করুন"
    >
      🖨 প্রিন্ট করুন
    </button>
  );
}