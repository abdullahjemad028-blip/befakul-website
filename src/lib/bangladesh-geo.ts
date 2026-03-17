// Bangladesh divisions and their districts
// Used in dropdowns across the madrasa system

export const DIVISIONS = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রংপুর",
  "ময়মনসিংহ",
] as const;

export type Division = (typeof DIVISIONS)[number];

export const DISTRICTS_BY_DIVISION: Record<Division, string[]> = {
  "ঢাকা": [
    "ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "মানিকগঞ্জ", "মুন্সিগঞ্জ",
    "নরসিংদী", "ফরিদপুর", "গোপালগঞ্জ", "কিশোরগঞ্জ", "মাদারীপুর",
    "রাজবাড়ী", "শরীয়তপুর", "টাঙ্গাইল",
  ],
  "চট্টগ্রাম": [
    "চট্টগ্রাম", "কক্সবাজার", "রাঙামাটি", "বান্দরবান", "খাগড়াছড়ি",
    "ফেনী", "লক্ষ্মীপুর", "নোয়াখালী", "কুমিল্লা", "চাঁদপুর",
    "ব্রাহ্মণবাড়িয়া",
  ],
  "রাজশাহী": [
    "রাজশাহী", "চাঁপাইনবাবগঞ্জ", "নওগাঁ", "নাটোর", "পাবনা",
    "সিরাজগঞ্জ", "বগুড়া", "জয়পুরহাট",
  ],
  "খুলনা": [
    "খুলনা", "বাগেরহাট", "সাতক্ষীরা", "যশোর", "নড়াইল",
    "মাগুরা", "ঝিনাইদহ", "কুষ্টিয়া", "মেহেরপুর", "চুয়াডাঙ্গা",
  ],
  "বরিশাল": [
    "বরিশাল", "পটুয়াখালী", "ভোলা", "পিরোজপুর", "ঝালকাঠি", "বরগুনা",
  ],
  "সিলেট": [
    "সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ",
  ],
  "রংপুর": [
    "রংপুর", "দিনাজপুর", "ঠাকুরগাঁও", "পঞ্চগড়", "নীলফামারী",
    "লালমনিরহাট", "কুড়িগ্রাম", "গাইবান্ধা",
  ],
  "ময়মনসিংহ": [
    "ময়মনসিংহ", "নেত্রকোণা", "জামালপুর", "শেরপুর",
  ],
};

// Get all districts as a flat list
export function getAllDistricts(): string[] {
  return Object.values(DISTRICTS_BY_DIVISION).flat().sort();
}

// Get districts for a specific division
export function getDistrictsByDivision(division: string): string[] {
  return DISTRICTS_BY_DIVISION[division as Division] ?? [];
}