import Link from "next/link";

export default function ExamResultsSection() {
  return (
    <section
      className="w-full py-14 md:py-20"
      style={{ backgroundColor: "var(--color-bg-section)" }}
      aria-labelledby="exam-results-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2
          id="exam-results-heading"
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "var(--font-bangla)" }}
        >
          পরীক্ষা ও ফলাফল
        </h2>

        <p
          className="text-base text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8"
          style={{ fontFamily: "var(--font-bangla)" }}
        >
          বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ পরিচালিত সকল পরীক্ষার ফলাফল
          নির্ধারিত সময়ে প্রকাশ করা হয়। শিক্ষার্থীরা রোল ও রেজিস্ট্রেশন
          নম্বরের মাধ্যমে সহজেই ফলাফল দেখতে পারবেন।
        </p>

        <Link
          href="/results"
          className="inline-block px-8 py-3 rounded text-base font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            backgroundColor: "var(--color-primary)",
            outlineColor: "var(--color-primary)",
            fontFamily: "var(--font-bangla)",
          }}
        >
          ফলাফল দেখুন →
        </Link>

      </div>
    </section>
  );
}