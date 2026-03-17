"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const from         = searchParams.get("from") ?? "/admin/notices";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "লগইন ব্যর্থ হয়েছে");
        setLoading(false);
        return;
      }

      // Redirect to original destination or admin notices
      router.push(from);
      router.refresh();

    } catch {
      setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      style={{ fontFamily: "var(--font-bangla)" }}
    >
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-4"
            style={{ backgroundColor: "var(--color-primary)" }}
            aria-hidden="true"
          >
            বেফাক
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            অ্যাডমিন লগইন
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg px-6 py-8 space-y-5"
          noValidate
        >
          {/* Error message */}
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              ব্যবহারকারীর নাম
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full border border-gray-300 rounded px-3 py-2 text-base text-gray-900 focus:outline-none focus:ring-2"
              style={{
                fontFamily:    "var(--font-english)",
                outlineColor:  "var(--color-primary)",
              }}
              placeholder="admin"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded px-3 py-2 text-base text-gray-900 focus:outline-none focus:ring-2"
              style={{
                fontFamily:   "var(--font-english)",
                outlineColor: "var(--color-primary)",
              }}
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-2.5 text-base font-medium text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>

        {/* Back to site */}
        <p className="text-center mt-6 text-sm text-gray-500">
          <a
            href="/"
            className="hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            ← মূল সাইটে ফিরুন
          </a>
        </p>

      </div>
    </div>
  );
}