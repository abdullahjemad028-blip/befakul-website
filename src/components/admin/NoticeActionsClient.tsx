"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id:          string;
  isPublished: boolean;
  isArchived:  boolean;
}

export default function NoticeActionsClient({
  id,
  isPublished,
  isArchived,
}: Props) {
  const router              = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePublishToggle() {
    setLoading(true);
    const endpoint = isPublished
      ? `/api/admin/notices/${id}/unpublish`
      : `/api/admin/notices/${id}/publish`;

    await fetch(endpoint, { method: "PATCH" });
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "এই নোটিশটি আর্কাইভ করবেন? এটি পাবলিক থেকে সরিয়ে নেওয়া হবে।",
    );
    if (!confirmed) return;

    setLoading(true);
    await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Edit */}
      {!isArchived && (
        <a
          href={`/admin/notices/${id}/edit`}
          className="px-3 py-1 text-xs font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          সম্পাদনা
        </a>
      )}

      {/* Publish / Unpublish */}
      {!isArchived && (
        <button
          onClick={handlePublishToggle}
          disabled={loading}
          className="px-3 py-1 text-xs font-medium rounded border text-white disabled:opacity-50"
          style={{ backgroundColor: isPublished ? "#b45309" : "var(--color-primary)" }}
        >
          {isPublished ? "আনপাবলিশ" : "প্রকাশ করুন"}
        </button>
      )}

      {/* Delete / Archive */}
      {!isArchived && (
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1 text-xs font-medium rounded border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          আর্কাইভ
        </button>
      )}
    </div>
  );
}