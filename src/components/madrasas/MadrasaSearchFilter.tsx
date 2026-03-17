"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DIVISIONS, getDistrictsByDivision } from "@/lib/bangladesh-geo";

export default function MadrasaSearchFilter() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [search,   setSearch]   = useState(searchParams.get("search")   ?? "");
  const [division, setDivision] = useState(searchParams.get("division") ?? "");
  const [district, setDistrict] = useState(searchParams.get("district") ?? "");

  const districts = division ? getDistrictsByDivision(division) : [];

  // When division changes, reset district
  useEffect(() => {
    setDistrict("");
  }, [division]);

  function handleSearch() {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search",   search.trim());
    if (division)      params.set("division", division);
    if (district)      params.set("district", district);
    params.set("page", "1");
    router.push(`/madrasas?${params.toString()}`);
  }

  function handleReset() {
    setSearch("");
    setDivision("");
    setDistrict("");
    router.push("/madrasas");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div
      className="border border-gray-200 rounded-lg p-4 mb-6"
      style={{ backgroundColor: "var(--color-bg-section)" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Search input */}
        <div className="lg:col-span-2">
          <label
            htmlFor="madrasa-search"
            className="block text-xs font-semibold text-gray-600 mb-1"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            নাম বা রেজিস্ট্রেশন নম্বর
          </label>
          <input
            id="madrasa-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="মাদ্রাসার নাম লিখুন..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2"
            style={{
              fontFamily:   "var(--font-bangla)",
              outlineColor: "var(--color-primary)",
            }}
          />
        </div>

        {/* Division dropdown */}
        <div>
          <label
            htmlFor="division-filter"
            className="block text-xs font-semibold text-gray-600 mb-1"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            বিভাগ
          </label>
          <select
            id="division-filter"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 bg-white"
            style={{
              fontFamily:   "var(--font-bangla)",
              outlineColor: "var(--color-primary)",
            }}
          >
            <option value="">সকল বিভাগ</option>
            {DIVISIONS.map((div) => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        {/* District dropdown — depends on division */}
        <div>
          <label
            htmlFor="district-filter"
            className="block text-xs font-semibold text-gray-600 mb-1"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            জেলা
          </label>
          <select
            id="district-filter"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!division}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{
              fontFamily:   "var(--font-bangla)",
              outlineColor: "var(--color-primary)",
            }}
          >
            <option value="">সকল জেলা</option>
            {districts.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Action Buttons */}
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