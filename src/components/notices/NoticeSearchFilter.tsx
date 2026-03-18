"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NOTICE_CATEGORIES } from "@/lib/notice-categories";

export default function NoticeSearchFilter() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [search,   setSearch]   = useState(searchParams.get("search")   ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");

  function handleSearch() {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search",   search.trim());
    if (category)      params.set("category", category);
    params.set("page", "1");
    router.push(`/notices?${params.toString()}`);
  }

  function handleReset() {
    setSearch("");
    setCategory("");
    router.push("/notices");
  }

  return (
    <div
      className="border border-gray-200 rounded-lg p-4 mb-6"
      style={{ backgroundColor: "var(--color-bg-section)" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* Search */}
        <div className="sm:col-span-2">
          <label
            htmlFor="notice-search"
            className="block text-xs font-semibold text-gray-600 mb-1"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            নোটিশ খুঁজুন
          </label>
          <input
            id="notice-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="শিরোনাম লিখুন..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 bg-white"
            style={{
              fontFamily:   "var(--font-bangla)",
              outlineColor: "var(--color-primary)",
            }}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label
            htmlFor="category-filter"
            className="block text-xs font-semibold text-gray-600 mb-1"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            ক্যাটাগরি
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2"
            style={{
              fontFamily:   "var(--font-bangla)",
              outlineColor: "var(--color-primary)",
            }}
          >
            <option value="">সকল ক্যাটাগরি</option>
            {NOTICE_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={handleSearch}
          className="px-5 py-2 text-sm font-medium text-white rounded"
          style={{
            backgroundColor: "var(--color-primary)",
            fontFamily:      "var(--font-bangla)",
          }}
        >
          খুঁজুন
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2 text-sm font-medium text-gray-600 rounded border border-gray-300 hover:bg-white"
          style={{ fontFamily: "var(--font-bangla)" }}
        >
          রিসেট
        </button>
      </div>
    </div>
  );
}