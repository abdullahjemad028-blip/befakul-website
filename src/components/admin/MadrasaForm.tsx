"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DIVISIONS, getDistrictsByDivision } from "@/lib/bangladesh-geo";

interface MadrasaFormData {
  name_bn:         string;
  registrationNo:  string;
  district:        string;
  division:        string;
  establishedYear: string;
  isActive:        boolean;
}

interface Props {
  initialData?: MadrasaFormData & { id: string };
}

const EMPTY: MadrasaFormData = {
  name_bn:         "",
  registrationNo:  "",
  district:        "",
  division:        "",
  establishedYear: "",
  isActive:        true,
};

export default function MadrasaForm({ initialData }: Props) {
  const router    = useRouter();
  const isEditing = !!initialData;

  const [form,   setForm]   = useState<MadrasaFormData>(initialData ?? EMPTY);
  const [errors, setErrors] = useState<Partial<MadrasaFormData>>({});
  const [saving, setSaving] = useState(false);

  const districts = form.division
    ? getDistrictsByDivision(form.division)
    : [];

  // Reset district when division changes
  useEffect(() => {
    if (!isEditing) {
      setForm((prev) => ({ ...prev, district: "" }));
    }
  }, [form.division, isEditing]);

  function validate(): boolean {
    const e: Partial<MadrasaFormData> = {};
    if (!form.name_bn.trim())        e.name_bn        = "নাম আবশ্যক";
    if (!form.registrationNo.trim()) e.registrationNo = "রেজিস্ট্রেশন নম্বর আবশ্যক";
    if (!form.division)              e.division        = "বিভাগ আবশ্যক";
    if (!form.district)              e.district        = "জেলা আবশ্যক";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      name_bn:         form.name_bn.trim(),
      registrationNo:  form.registrationNo.trim(),
      district:        form.district,
      division:        form.division,
      establishedYear: form.establishedYear
        ? parseInt(form.establishedYear, 10)
        : null,
      isActive: form.isActive,
    };

    const res = isEditing
      ? await fetch(`/api/admin/madrasas/${initialData.id}`, {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        })
      : await fetch("/api/admin/madrasas", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        });

    setSaving(false);

    if (res.ok) {
      router.push("/admin/madrasas");
      router.refresh();
    } else {
      const data = await res.json() as { error?: string };
      alert(data.error ?? "একটি ত্রুটি হয়েছে।");
    }
  }

  return (
    <div className="max-w-2xl" style={{ fontFamily: "var(--font-bangla)" }}>

      {/* Name */}
      <div className="mb-5">
        <label htmlFor="name_bn" className="block text-sm font-semibold text-gray-700 mb-1">
          মাদ্রাসার নাম <span className="text-red-500">*</span>
        </label>
        <input
          id="name_bn"
          type="text"
          value={form.name_bn}
          onChange={(e) => setForm({ ...form, name_bn: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2"
          style={{ fontFamily: "var(--font-bangla)", outlineColor: "var(--color-primary)" }}
          placeholder="মাদ্রাসার পূর্ণ নাম লিখুন"
        />
        {errors.name_bn && (
          <p className="text-red-500 text-sm mt-1">{errors.name_bn}</p>
        )}
      </div>

      {/* Registration No */}
      <div className="mb-5">
        <label htmlFor="registrationNo" className="block text-sm font-semibold text-gray-700 mb-1">
          রেজিস্ট্রেশন নম্বর <span className="text-red-500">*</span>
        </label>
        <input
          id="registrationNo"
          type="text"
          value={form.registrationNo}
          onChange={(e) => setForm({ ...form, registrationNo: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2"
          style={{ fontFamily: "var(--font-english)", outlineColor: "var(--color-primary)" }}
          placeholder="যেমন: বেফাক-০০১১"
        />
        {errors.registrationNo && (
          <p className="text-red-500 text-sm mt-1">{errors.registrationNo}</p>
        )}
      </div>

      {/* Division */}
      <div className="mb-5">
        <label htmlFor="division" className="block text-sm font-semibold text-gray-700 mb-1">
          বিভাগ <span className="text-red-500">*</span>
        </label>
        <select
          id="division"
          value={form.division}
          onChange={(e) => setForm({ ...form, division: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-base bg-white focus:outline-none focus:ring-2"
          style={{ fontFamily: "var(--font-bangla)", outlineColor: "var(--color-primary)" }}
        >
          <option value="">বিভাগ নির্বাচন করুন</option>
          {DIVISIONS.map((div) => (
            <option key={div} value={div}>{div}</option>
          ))}
        </select>
        {errors.division && (
          <p className="text-red-500 text-sm mt-1">{errors.division}</p>
        )}
      </div>

      {/* District */}
      <div className="mb-5">
        <label htmlFor="district" className="block text-sm font-semibold text-gray-700 mb-1">
          জেলা <span className="text-red-500">*</span>
        </label>
        <select
          id="district"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
          disabled={!form.division}
          className="w-full border border-gray-300 rounded px-3 py-2 text-base bg-white focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-bangla)", outlineColor: "var(--color-primary)" }}
        >
          <option value="">জেলা নির্বাচন করুন</option>
          {districts.map((dist) => (
            <option key={dist} value={dist}>{dist}</option>
          ))}
        </select>
        {errors.district && (
          <p className="text-red-500 text-sm mt-1">{errors.district}</p>
        )}
      </div>

      {/* Established Year */}
      <div className="mb-5">
        <label htmlFor="establishedYear" className="block text-sm font-semibold text-gray-700 mb-1">
          প্রতিষ্ঠা সাল (ঐচ্ছিক)
        </label>
        <input
          id="establishedYear"
          type="number"
          value={form.establishedYear}
          onChange={(e) => setForm({ ...form, establishedYear: e.target.value })}
          min={1800}
          max={new Date().getFullYear()}
          className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2"
          style={{ fontFamily: "var(--font-english)", outlineColor: "var(--color-primary)" }}
          placeholder="যেমন: 1985"
        />
      </div>

      {/* isActive — only show in edit mode */}
      {isEditing && (
        <div className="mb-5 flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4 accent-green-700"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            সক্রিয় (Active)
          </label>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2 text-sm font-medium text-white rounded disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : isEditing ? "আপডেট করুন" : "সংরক্ষণ করুন"}
        </button>
        <a
          href="/admin/madrasas"
          className="px-5 py-2 text-sm font-medium text-gray-500 hover:underline"
        >
          বাতিল
        </a>
      </div>
    </div>
  );
}