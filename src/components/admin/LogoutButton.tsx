"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router         = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-3 py-1.5 text-sm font-medium rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      style={{ fontFamily: "var(--font-bangla)" }}
    >
      {loading ? "..." : "লগআউট"}
    </button>
  );
}