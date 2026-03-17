import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="w-full bg-gradient-to-b from-white to-gray-50 border-b border-gray-200"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl text-center mx-auto md:text-left md:mx-0">

          {/* Primary Heading */}
          <h1
            id="hero-heading"
            className="text-3xl md:text-5xl font-bold text-gray-900 leading-snug tracking-tight"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ
          </h1>

          {/* Tagline */}
          <p
            className="mt-5 text-lg md:text-xl text-gray-700 leading-relaxed"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            বাংলাদেশের কওমি মাদরাসা শিক্ষাব্যবস্থার সর্বোচ্চ তত্ত্বাবধায়ক বোর্ড
          </p>

          {/* Supporting Description */}
          <p
            className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            বেফাক পরিচালিত পরীক্ষার ফলাফল, নোটিশ এবং শিক্ষাপ্রতিষ্ঠান সংক্রান্ত সকল তথ্য
            এই ওয়েবসাইটে পাওয়া যাবে।
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">

            {/* Primary CTA */}
            <Link
              href="https://wifaqresult.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3 rounded-lg text-base font-semibold text-white transition-all duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                backgroundColor: "var(--color-primary)",
                outlineColor: "var(--color-primary)",
              }}
            >
              ফলাফল দেখুন
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/notices"
              className="inline-flex items-center justify-center px-7 py-3 rounded-lg text-base font-semibold border-2 transition-all duration-200 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
                outlineColor: "var(--color-primary)",
              }}
            >
              সকল নোটিশ
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}