// prisma/seed.ts
// ============================================================
// Befaqul Madarisil Arabia Bangladesh — Development Seed
// Run with: npx prisma db seed
// Safe to re-run — uses upsert to avoid duplicates
// ============================================================

import { PrismaClient, ExamLevel, ResultStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ──────────────────────────────────────────
  // SEED 1 — Stats
  // Seeded first — no dependencies
  // ──────────────────────────────────────────

  console.log("📊 Seeding stats...");

  const statsData = [
    { key: "madrasas",   value_bn: "১৫,০০০+",  order: 1 },
    { key: "students",   value_bn: "২৫ লক্ষ+",  order: 2 },
    { key: "exams",      value_bn: "১০+",        order: 3 },
    { key: "founded",    value_bn: "১৯৭৮",       order: 4 },
  ];

  for (const stat of statsData) {
    await prisma.stat.upsert({
      where:  { key: stat.key },
      update: { value_bn: stat.value_bn, order: stat.order },
      create: stat,
    });
  }

  console.log(`   ✓ ${statsData.length} stats seeded`);

  // ──────────────────────────────────────────
  // SEED 2 — Notices
  // ──────────────────────────────────────────

  console.log("📋 Seeding notices...");

  const noticesData = [
    {
      title_bn:    "২০২৫ সালের দাওরায়ে হাদিস পরীক্ষার সময়সূচি প্রকাশিত",
      body_bn:     "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ কর্তৃক ২০২৫ সালের দাওরায়ে হাদিস কেন্দ্রীয় পরীক্ষার সময়সূচি প্রকাশ করা হয়েছে। পরীক্ষা আগামী ১৫ মার্চ ২০২৫ তারিখ থেকে শুরু হবে। সংশ্লিষ্ট সকল মাদরাসা কর্তৃপক্ষকে প্রস্তুতি গ্রহণের জন্য অনুরোধ করা হচ্ছে।",
      publishedAt: new Date("2025-01-15"),
      isPublished: true,
      isPdf:       true,
      pdfUrl:      "/notices/exam-routine-dawra-2025.pdf",
    },
    {
      title_bn:    "২০২৪ সালের দাওরায়ে হাদিস পরীক্ষার ফলাফল প্রকাশিত হয়েছে",
      body_bn:     "২০২৪ সালের কেন্দ্রীয় দাওরায়ে হাদিস পরীক্ষার ফলাফল প্রকাশিত হয়েছে। শিক্ষার্থীরা রোল ও রেজিস্ট্রেশন নম্বরের মাধ্যমে এই ওয়েবসাইট থেকে ফলাফল দেখতে পারবেন।",
      publishedAt: new Date("2024-06-10"),
      isPublished: true,
      isPdf:       false,
      pdfUrl:      null,
    },
    {
      title_bn:    "নতুন মাদরাসা নিবন্ধনের আবেদন গ্রহণ শুরু — ২০২৫",
      body_bn:     "২০২৫ শিক্ষাবর্ষের জন্য নতুন মাদরাসা নিবন্ধনের আবেদন গ্রহণ শুরু হয়েছে। আগ্রহী প্রতিষ্ঠানসমূহকে নির্ধারিত ফর্ম পূরণ করে বোর্ড কার্যালয়ে জমা দেওয়ার জন্য অনুরোধ করা হচ্ছে। আবেদনের শেষ তারিখ ২৮ ফেব্রুয়ারি ২০২৫।",
      publishedAt: new Date("2025-01-01"),
      isPublished: true,
      isPdf:       true,
      pdfUrl:      "/notices/madrasa-registration-form-2025.pdf",
    },
    {
      title_bn:    "২০২৫ সালের ভর্তি নীতিমালা জারি",
      body_bn:     "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ ২০২৫ শিক্ষাবর্ষের জন্য অধিভুক্ত মাদরাসাসমূহের ভর্তি নীতিমালা জারি করেছে। সকল মাদরাসা কর্তৃপক্ষ এই নীতিমালা অনুসরণ করতে বাধ্য থাকবেন।",
      publishedAt: new Date("2024-12-20"),
      isPublished: true,
      isPdf:       true,
      pdfUrl:      "/notices/admission-policy-2025.pdf",
    },
    {
      title_bn:    "সানাবিয়া উলইয়া পরীক্ষার কেন্দ্র তালিকা প্রকাশ",
      body_bn:     "২০২৫ সালের সানাবিয়া উলইয়া পরীক্ষার কেন্দ্র তালিকা প্রকাশিত হয়েছে। পরীক্ষার্থীরা তাদের প্রবেশপত্রে উল্লিখিত কেন্দ্রে উপস্থিত হবেন।",
      publishedAt: new Date("2025-01-10"),
      isPublished: true,
      isPdf:       true,
      pdfUrl:      "/notices/center-list-sanabia-ulya-2025.pdf",
    },
    {
      title_bn:    "বার্ষিক পরীক্ষা কমিটির সভার কার্যবিবরণী",
      body_bn:     "বেফাক পরীক্ষা কমিটির সর্বশেষ সভার কার্যবিবরণী প্রকাশিত হয়েছে। সভায় ২০২৫ সালের পরীক্ষা পরিচালনা সংক্রান্ত বিভিন্ন সিদ্ধান্ত গৃহীত হয়।",
      publishedAt: new Date("2024-12-15"),
      isPublished: true,
      isPdf:       true,
      pdfUrl:      "/notices/committee-minutes-dec-2024.pdf",
    },
    {
      title_bn:    "অধিভুক্ত মাদরাসার বার্ষিক তথ্য হালনাগাদ নির্দেশিকা",
      body_bn:     "সকল অধিভুক্ত মাদরাসাকে ২০২৫ সালের মধ্যে প্রাতিষ্ঠানিক তথ্য হালনাগাদ করার নির্দেশ দেওয়া হচ্ছে। তথ্য হালনাগাদ না করলে অধিভুক্তি বাতিল হতে পারে।",
      publishedAt: new Date("2024-11-30"),
      isPublished: true,
      isPdf:       false,
      pdfUrl:      null,
    },
    {
      // Draft notice — not yet published
      title_bn:    "২০২৫ সালের হিফজ পরীক্ষার সময়সূচি (খসড়া)",
      body_bn:     "২০২৫ সালের কেন্দ্রীয় হিফজ পরীক্ষার খসড়া সময়সূচি প্রস্তুত করা হচ্ছে। চূড়ান্ত সময়সূচি শীঘ্রই প্রকাশিত হবে।",
      publishedAt: new Date("2025-02-01"),
      isPublished: false,   // Draft — not visible on site
      isPdf:       false,
      pdfUrl:      null,
    },
  ];

  // Notices have no unique field to upsert on — use deleteMany + createMany
  // This is safe for development seeds only
  await prisma.notice.deleteMany();
  await prisma.notice.createMany({ data: noticesData });

  console.log(`   ✓ ${noticesData.length} notices seeded`);

  // ──────────────────────────────────────────
  // SEED 3 — Exams
  // ──────────────────────────────────────────

  console.log("📝 Seeding exams...");

  const examsData = [
    {
      name_bn:  "দাওরায়ে হাদিস কেন্দ্রীয় পরীক্ষা",
      year:     2025,
      level:    ExamLevel.DAWRA,
      isActive: true,
    },
    {
      name_bn:  "দাওরায়ে হাদিস কেন্দ্রীয় পরীক্ষা",
      year:     2024,
      level:    ExamLevel.DAWRA,
      isActive: false,
    },
    {
      name_bn:  "সানাবিয়া উলইয়া কেন্দ্রীয় পরীক্ষা",
      year:     2025,
      level:    ExamLevel.TAKMIL,
      isActive: true,
    },
    {
      name_bn:  "সানাবিয়া কেন্দ্রীয় পরীক্ষা",
      year:     2025,
      level:    ExamLevel.OTHER,
      isActive: true,
    },
    {
      name_bn:  "হিফজুল কুরআন কেন্দ্রীয় পরীক্ষা",
      year:     2025,
      level:    ExamLevel.HIFZ,
      isActive: true,
    },
  ];

  // Delete results first (FK constraint) then exams
  await prisma.result.deleteMany();
  await prisma.exam.deleteMany();

  const createdExams = await prisma.exam.createManyAndReturn({
    data: examsData,
  });

  console.log(`   ✓ ${createdExams.length} exams seeded`);

  // ──────────────────────────────────────────
  // SEED 4 — Results
  // Linked to the 2024 Dawra exam (completed)
  // ──────────────────────────────────────────

  console.log("🎓 Seeding results...");

  // Find the 2024 completed exam to attach results to
  const exam2024 = createdExams.find(
    (e) => e.year === 2024 && e.level === ExamLevel.DAWRA,
  );

  if (exam2024) {
    const resultsData = [
      {
        examId:         exam2024.id,
        roll:           "২৪০১০১",
        registrationNo: "ডি-২০২৪-০০১",
        studentName_bn: "মুহাম্মদ আবদুল্লাহ",
        status:         ResultStatus.PASS,
        grade:          "মুমতাজ",
      },
      {
        examId:         exam2024.id,
        roll:           "২৪০১০২",
        registrationNo: "ডি-২০২৪-০০২",
        studentName_bn: "মুহাম্মদ ইব্রাহিম খলিল",
        status:         ResultStatus.PASS,
        grade:          "জায়্যিদ জিদ্দান",
      },
      {
        examId:         exam2024.id,
        roll:           "২৪০১০৩",
        registrationNo: "ডি-২০২৪-০০৩",
        studentName_bn: "আবু বকর সিদ্দিকী",
        status:         ResultStatus.PASS,
        grade:          "জায়্যিদ",
      },
      {
        examId:         exam2024.id,
        roll:           "২৪০১০৪",
        registrationNo: "ডি-২০২৪-০০৪",
        studentName_bn: "মুহাম্মদ উমর ফারুক",
        status:         ResultStatus.FAIL,
        grade:          null,
      },
      {
        examId:         exam2024.id,
        roll:           "২৪০১০৫",
        registrationNo: "ডি-২০২৪-০০৫",
        studentName_bn: "মুহাম্মদ ইউসুফ আলী",
        status:         ResultStatus.PASS,
        grade:          "মুমতাজ",
      },
    ];

    await prisma.result.createMany({ data: resultsData });
    console.log(`   ✓ ${resultsData.length} results seeded`);
  }

  // ──────────────────────────────────────────
  // SEED 5 — Madrasas
  // ──────────────────────────────────────────

  console.log("🕌 Seeding madrasas...");

  const madrasasData = [
    {
      name_bn:         "দারুল উলূম হাটহাজারী",
      registrationNo:  "বেফাক-০০০১",
      district:        "চট্টগ্রাম",
      division:        "চট্টগ্রাম বিভাগ",
      establishedYear: 1901,
      isActive:        true,
    },
    {
      name_bn:         "দারুল উলূম দেওবন্দ বাংলাদেশ",
      registrationNo:  "বেফাক-০০০২",
      district:        "ঢাকা",
      division:        "ঢাকা বিভাগ",
      establishedYear: 1960,
      isActive:        true,
    },
    {
      name_bn:         "জামিয়া ইসলামিয়া পটিয়া",
      registrationNo:  "বেফাক-০০০৩",
      district:        "চট্টগ্রাম",
      division:        "চট্টগ্রাম বিভাগ",
      establishedYear: 1948,
      isActive:        true,
    },
    {
      name_bn:         "জামিয়া রাহমানিয়া আরাবিয়া মুহাম্মদপুর",
      registrationNo:  "বেফাক-০০০৪",
      district:        "ঢাকা",
      division:        "ঢাকা বিভাগ",
      establishedYear: 1977,
      isActive:        true,
    },
    {
      name_bn:         "মারকাযুদ দাওয়াহ আল ইসলামিয়া ঢাকা",
      registrationNo:  "বেফাক-০০০৫",
      district:        "ঢাকা",
      division:        "ঢাকা বিভাগ",
      establishedYear: 1980,
      isActive:        true,
    },
    {
      name_bn:         "জামিয়া ইসলামিয়া দারুল উলূম মাদানীনগর",
      registrationNo:  "বেফাক-০০০৬",
      district:        "ঢাকা",
      division:        "ঢাকা বিভাগ",
      establishedYear: 1985,
      isActive:        true,
    },
    {
      name_bn:         "জামিয়া শারইয়্যাহ মালিবাগ",
      registrationNo:  "বেফাক-০০০৭",
      district:        "ঢাকা",
      division:        "ঢাকা বিভাগ",
      establishedYear: 1990,
      isActive:        true,
    },
    {
      name_bn:         "জামিয়া ইসলামিয়া ইউনুছিয়া ব্রাহ্মণবাড়িয়া",
      registrationNo:  "বেফাক-০০০৮",
      district:        "ব্রাহ্মণবাড়িয়া",
      division:        "চট্টগ্রাম বিভাগ",
      establishedYear: 1955,
      isActive:        true,
    },
    {
      name_bn:         "দারুল উলূম বগুড়া",
      registrationNo:  "বেফাক-০০০৯",
      district:        "বগুড়া",
      division:        "রাজশাহী বিভাগ",
      establishedYear: 1972,
      isActive:        true,
    },
    {
      name_bn:         "জামিয়া ইসলামিয়া সিলেট",
      registrationNo:  "বেফাক-০০১০",
      district:        "সিলেট",
      division:        "সিলেট বিভাগ",
      establishedYear: 1965,
      isActive:        true,
    },
  ];

  await prisma.madrasa.deleteMany();

  for (const madrasa of madrasasData) {
    await prisma.madrasa.upsert({
      where:  { registrationNo: madrasa.registrationNo },
      update: madrasa,
      create: madrasa,
    });
  }

  console.log(`   ✓ ${madrasasData.length} madrasas seeded`);

  // ──────────────────────────────────────────
  // DONE
  // ──────────────────────────────────────────

  console.log("");
  console.log("✅ Seed completed successfully.");
  console.log("   Open Prisma Studio to verify: npx prisma studio");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });