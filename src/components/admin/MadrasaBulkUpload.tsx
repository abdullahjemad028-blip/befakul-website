"use client";

import React, { useState, useRef } from "react";

interface RowResult {
  row:            number;
  name_bn:        string;
  registrationNo: string;
  status:         "success" | "skipped" | "error";
  reason?:        string;
}

interface UploadSummary {
  total:   number;
  success: number;
  skipped: number;
  errors:  number;
}

interface UploadResponse {
  summary:  UploadSummary;
  results:  RowResult[];
  hasMore:  boolean;
  error?:   string;
}

type UploadState = "idle" | "uploading" | "done" | "error";

export default function MadrasaBulkUpload() {
  const fileInputRef              = useRef<HTMLInputElement>(null);
  const [state,     setState]     = useState<UploadState>("idle");
  const [fileName,  setFileName]  = useState("");
  const [response,  setResponse]  = useState<UploadResponse | null>(null);
  const [errorMsg,  setErrorMsg]  = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setState("idle");
    setResponse(null);
    setErrorMsg("");
  }

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setState("uploading");
    setErrorMsg("");
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/madrasas/bulk", {
        method: "POST",
        body:   formData,
      });

      const data = await res.json() as UploadResponse;

      if (!res.ok) {
        setErrorMsg(data.error ?? "আপলোড ব্যর্থ হয়েছে");
        setState("error");
        return;
      }

      setResponse(data);
      setState("done");

      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFileName("");

    } catch {
      setErrorMsg("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
      setState("error");
    }
  }

  function handleReset() {
    setState("idle");
    setResponse(null);
    setErrorMsg("");
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div
      className="border border-gray-200 rounded-lg p-6"
      style={{ fontFamily: "var(--font-bangla)" }}
    >
      <h2 className="text-lg font-bold text-gray-900 mb-1">
        Bulk আপলোড (Excel)
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Excel ফাইল থেকে একসাথে অনেক মাদ্রাসা যোগ করুন।
      </p>

      {/* Template Download */}
      <div
        className="mb-5 p-4 rounded border border-blue-200 text-sm text-blue-800"
        style={{ backgroundColor: "#eff6ff" }}
      >
        <p className="font-semibold mb-1">Excel ফাইলের কলাম হতে হবে:</p>
        <code
          className="block mt-1 text-xs bg-white border border-blue-100 rounded px-3 py-2"
          style={{ fontFamily: "var(--font-english)" }}
        >
          name_bn | registrationNo | district | division | establishedYear
        </code>
        <ul className="mt-2 space-y-0.5 text-xs">
          <li>• <strong>name_bn</strong> — মাদ্রাসার বাংলা নাম (আবশ্যক)</li>
          <li>• <strong>registrationNo</strong> — অনন্য রেজিস্ট্রেশন নম্বর (আবশ্যক)</li>
          <li>• <strong>district</strong> — জেলা বাংলায় (আবশ্যক)</li>
          <li>• <strong>division</strong> — বিভাগ বাংলায় (আবশ্যক)</li>
          <li>• <strong>establishedYear</strong> — প্রতিষ্ঠা সাল সংখ্যায়, যেমন 1985 (ঐচ্ছিক)</li>
        </ul>
      </div>

      {/* File Input */}
      <div className="mb-4">
        <label
          htmlFor="bulk-file"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Excel ফাইল নির্বাচন করুন (.xlsx)
        </label>
        <input
          id="bulk-file"
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 border border-gray-300 rounded px-3 py-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:text-white cursor-pointer"
          style={
            {
              "--file-bg": "var(--color-primary)",
            } as React.CSSProperties
          }
        />
        {fileName && (
          <p className="text-xs text-gray-500 mt-1">
            নির্বাচিত: {fileName}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleUpload}
          disabled={!fileName || state === "uploading"}
          className="px-5 py-2 text-sm font-medium text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {state === "uploading" ? "আপলোড হচ্ছে..." : "আপলোড শুরু করুন"}
        </button>

        {(state === "done" || state === "error") && (
          <button
            onClick={handleReset}
            className="px-5 py-2 text-sm font-medium text-gray-600 rounded border border-gray-300 hover:bg-gray-50"
          >
            নতুন আপলোড
          </button>
        )}
      </div>

      {/* Error Message */}
      {state === "error" && errorMsg && (
        <div className="mt-4 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Success Summary */}
      {state === "done" && response && (
        <div className="mt-6 space-y-4">

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "মোট",       value: response.summary.total,   color: "text-gray-700",  bg: "bg-gray-50"   },
              { label: "সফল",       value: response.summary.success, color: "text-green-700", bg: "bg-green-50"  },
              { label: "এড়িয়ে গেছে", value: response.summary.skipped, color: "text-yellow-700",bg: "bg-yellow-50" },
              { label: "ত্রুটি",    value: response.summary.errors,  color: "text-red-700",   bg: "bg-red-50"    },
            ].map((item) => (
              <div
                key={item.label}
                className={`${item.bg} rounded border border-gray-200 p-3 text-center`}
              >
                <p className={`text-2xl font-bold ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Row Results Table */}
          {response.results.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                বিস্তারিত রিপোর্ট
                {response.hasMore && (
                  <span className="text-gray-400 font-normal ml-1">
                    (প্রথম ১০০ টি দেখানো হচ্ছে)
                  </span>
                )}
              </h3>
              <div className="border border-gray-200 rounded overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">সারি</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">নাম</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">রেজি. নম্বর</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">অবস্থা</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">কারণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {response.results.map((r) => (
                      <tr key={`${r.row}-${r.registrationNo}`} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{r.row}</td>
                        <td className="px-3 py-2 text-gray-800 max-w-32 truncate">
                          {r.name_bn}
                        </td>
                        <td
                          className="px-3 py-2 text-gray-600"
                          style={{ fontFamily: "var(--font-english)" }}
                        >
                          {r.registrationNo}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-block font-semibold px-1.5 py-0.5 rounded text-xs ${
                              r.status === "success"
                                ? "bg-green-100 text-green-700"
                                : r.status === "skipped"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {r.status === "success"
                              ? "✓ সফল"
                              : r.status === "skipped"
                              ? "→ এড়িয়ে"
                              : "✗ ত্রুটি"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-500">
                          {r.reason ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}