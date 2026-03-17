import Link from "next/link";
export default function AboutSection() {
  return (
    <section
      className="w-full py-12 md:py-16"
      style={{ backgroundColor: "var(--color-bg-section)" }}
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">

          <h2
            id="about-heading"
            className="text-2xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            বোর্ড পরিচিতি
          </h2>

          <p
            className="text-base text-gray-700 leading-relaxed"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ দেশের কওমি মাদরাসা
            শিক্ষাব্যবস্থার সর্ববৃহৎ ও কেন্দ্রীয় বোর্ড। এই বোর্ডের
            তত্ত্বাবধানে সারা দেশে হাজারো মাদরাসা পরিচালিত হয় এবং
            নিয়মিতভাবে পরীক্ষা ও শিক্ষাক্রম কার্যক্রম সম্পন্ন করা হয়।
            শিক্ষার্থীদের ধর্মীয় ও নৈতিক শিক্ষা নিশ্চিত করাই এই বোর্ডের
            মূল লক্ষ্য।
          </p>

          <Link
            href="/about"
            className="inline-block mt-5 text-base font-medium underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
            style={{
              color: "var(--color-primary)",
              outlineColor: "var(--color-primary)",
              fontFamily: "var(--font-bangla)",
            }}
          >
            আরও পড়ুন →
          </Link>

        </div>
      </div>
    </section>
  );
}