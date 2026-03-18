"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NOTICE_CATEGORIES } from "@/lib/notice-categories";

interface NoticeFormData {
  title_bn:  string;
  body_bn:   string;
  isPdf:     boolean;
  pdfUrl:    string;
  category:  string;
  imageUrl:  string;
}

interface Props {
  initialData?: NoticeFormData & { id: string };
}

const EMPTY: NoticeFormData = {
  title_bn:  "",
  body_bn:   "",
  isPdf:     false,
  pdfUrl:    "",
  category:  "GENERAL",
  imageUrl:  "",
};

export default function NoticeForm({ initialData }: Props) {
  const router    = useRouter();
  const isEditing = !!initialData;

  const [form,   setForm]   = useState<NoticeFormData>(initialData ?? EMPTY);
  const [errors, setErrors] = useState<Partial<NoticeFormData>>({});
  const [saving, setSaving] = useState(false);

  function validate(): boolean {
    const e: Partial<NoticeFormData> = {};
    if (form.title_bn.trim().length < 5)  e.title_bn = "শিরোনাম কমপক্ষে ৫ অক্ষর হতে হবে";
    if (form.body_bn.trim().length < 20)  e.body_bn  = "বিবরণ কমপক্ষে ২০ অক্ষর হতে হবে";
    if (form.isPdf && !form.pdfUrl.trim()) e.pdfUrl  = "PDF URL দিতে হবে";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(publish: boolean) {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      title_bn:  form.title_bn.trim(),
      body_bn:   form.body_bn.trim(),
      isPdf:     form.isPdf,
      pdfUrl:    form.isPdf ? form.pdfUrl.trim() : null,
      category:  form.category,
      imageUrl:  form.imageUrl.trim() || null,
      publish,
    };

    let res: Response;

    if (isEditing) {
      res = await fetch(`/api/admin/notices/${initialData.id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      if (res.ok && publish) {
        await fetch(`/api/admin/notices/${initialData.id}/publish`, {
          method: "PATCH",
        });
      }
    } else {
      res = await fetch("/api/admin/notices", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
    }

    setSaving(false);

    if (res.ok) {
      router.push("/admin/notices");
      router.refresh();
    } else {
      const data = await res.json() as { error?: string };
      alert(data.error ?? "একটি ত্রুটি হয়েছে।");
    }
  }

  return (
    <div className="max-w-2xl" style={{ fontFamily: "var(--font-bangla)" }}>

      {/* Title */}
      <div className="mb-5">
        <label htmlFor="title_bn" className="block text-sm font-semibold text-gray-700 mb-1">
          শিরোনাম <span className="text-red-500">*</span>
        </label>
        <input
          id="title_bn"
          type="text"
          value={form.title_bn}
          onChange={(e) => setForm({ ...form, title_bn: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2"
          style={{ fontFamily: "var(--font-bangla)", outlineColor: "var(--color-primary)" }}
          placeholder="নোটিশের শিরোনাম লিখুন"
        />
        {errors.title_bn && <p className="text-red-500 text-sm mt-1">{errors.title_bn}</p>}
      </div>

      {/* Category */}
      <div className="mb-5">
        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
          ক্যাটাগরি <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-base bg-white focus:outline-none focus:ring-2"
          style={{ fontFamily: "var(--font-bangla)", outlineColor: "var(--color-primary)" }}
        >
          {NOTICE_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Body */}
      <div className="mb-5">
        <label htmlFor="body_bn" className="block text-sm font-semibold text-gray-700 mb-1">
          বিবরণ <span className="text-red-500">*</span>
        </label>
        <textarea
          id="body_bn"
          rows={8}
          value={form.body_bn}
          onChange={(e) => setForm({ ...form, body_bn: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 resize-y"
          style={{ fontFamily: "var(--font-bangla)", outlineColor: "var(--color-primary)" }}
          placeholder="নোটিশের বিস্তারিত বিবরণ লিখুন"
        />
        {errors.body_bn && <p className="text-red-500 text-sm mt-1">{errors.body_bn}</p>}
      </div>

      {/* Image URL */}
      <div className="mb-5">
        <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-1">
          ছবির URL (ঐচ্ছিক)
        </label>
        <input
          id="imageUrl"
          type="url"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2"
          style={{ fontFamily: "var(--font-english)", outlineColor: "var(--color-primary)" }}
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-gray-400 mt-1">
          ছবি অন্য জায়গায় upload করে URL এখানে বসান
        </p>
      </div>

      {/* isPdf */}
      <div className="mb-4 flex items-center gap-2">
        <input
          id="isPdf"
          type="checkbox"
          checked={form.isPdf}
          onChange={(e) => setForm({ ...form, isPdf: e.target.checked })}
          className="w-4 h-4 accent-green-700"
        />
        <label htmlFor="isPdf" className="text-sm font-medium text-gray-700">
          এই নোটিশে PDF সংযুক্ত আছে
        </label>
      </div>

      {/* PDF URL */}
      {form.isPdf && (
        <div className="mb-5">
          <label htmlFor="pdfUrl" className="block text-sm font-semibold text-gray-700 mb-1">
            PDF ফাইলের URL <span className="text-red-500">*</span>
          </label>
          <input
            id="pdfUrl"
            type="url"
            value={form.pdfUrl}
            onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2"
            style={{ fontFamily: "var(--font-english)", outlineColor: "var(--color-primary)" }}
            placeholder="https://example.com/notice.pdf"
          />
          {errors.pdfUrl && <p className="text-red-500 text-sm mt-1">{errors.pdfUrl}</p>}
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => handleSubmit(false)}
          disabled={saving}
          className="px-5 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          ড্রাফট সংরক্ষণ
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={saving}
          className="px-5 py-2 text-sm font-medium rounded text-white disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "প্রকাশ করুন"}
        </button>
        <a href="/admin/notices" className="px-5 py-2 text-sm text-gray-500 hover:underline">
          বাতিল
        </a>
      </div>
    </div>
  );
}