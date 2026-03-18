// Category label, color, value — এক জায়গায় রাখা হয়েছে
// সব জায়গায় এই file থেকে import করব

export const NOTICE_CATEGORIES = [
  {
    value: "EXAM",
    label: "পরীক্ষা সংক্রান্ত",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    value: "REGISTRATION",
    label: "মাদরাসা নিবন্ধন",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    value: "RESULT",
    label: "ফলাফল সংক্রান্ত",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    value: "GENERAL",
    label: "সাধারণ নোটিশ",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  {
    value: "INTERNATIONAL",
    label: "আন্তর্জাতিক বিষয়ক",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
] as const;

export type NoticeCategoryValue =
  (typeof NOTICE_CATEGORIES)[number]["value"];

export function getCategoryInfo(value: string) {
  return (
    NOTICE_CATEGORIES.find((c) => c.value === value) ??
    NOTICE_CATEGORIES[3] // default: GENERAL
  );
}