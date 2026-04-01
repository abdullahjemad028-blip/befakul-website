import React from "react";
import Link from "next/link";

const currentYear = new Date().getFullYear();

const quickLinks = [
  { label: "হোম", href: "/" },
  { label: "বোর্ড পরিচিতি", href: "/about" },
  { label: "নোটিশ বোর্ড", href: "/notices" },
  { label: "মাদ্রাসা তালিকা", href: "/madrasas" },
  { label: "নেতৃত্ব ও বক্তব্য", href: "/leadership" },
  { label: "যোগাযোগ", href: "/contact" },
];

const importantLinks = [
  { label: "পরীক্ষার ফলাফল", href: "/results" },
  { label: "অনলাইন নিবন্ধন", href: "/madrasas" },
  { label: "নোটিশ আর্কাইভ", href: "/notices" },
  { label: "বেফাক ইতিহাস", href: "/about" },
];

const departments = [
  { name: "মাদরাসা রেজিস্ট্রেশন", phone: "০১৯৭৭৫০৫০৫৭" },
  { name: "পরীক্ষা নিয়ন্ত্রণ", phone: "০১৭১৬২৯৯৪৪৪" },
  { name: "হিসাব বিভাগ", phone: "০১৮৭৭৩৮৫৯৪৯" },
];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{ fontFamily: "var(--font-bangla)" }}
    >
      {/* ── Top dark band ────────────────────────────────── */}
      <div
        className="w-full py-10 md:py-14"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 — Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 border-white border-opacity-40"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    color: "white",
                  }}
                  aria-hidden="true"
                >
                  বেফাক
                </div>
                <p className="text-white font-bold text-sm leading-snug">
                  বেফাকুল মাদারিসิล<br />আরাবিয়া বাংলাদেশ
                </p>
              </div>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                বাংলাদেশের কওমি মাদরাসা শিক্ষাব্যবস্থার কেন্দ্রীয় তত্ত্বাবধায়ক বোর্ড। ১৯৭৮ সাল থেকে দেশের ধর্মীয় শিক্ষার উন্নয়নে নিরলসভাবে কার্যরত।
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                প্রতিষ্ঠাকাল: ১৯৭৮
              </p>
            </div>

            {/* Column 2 — Quick Links */}
            <div>
              <h3
                className="text-sm font-bold mb-4 pb-2 border-b"
                style={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                সাইটম্যাপ
              </h3>
              <nav aria-label="Footer সাইটম্যাপ">
                <ul className="space-y-2" role="list">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 rounded"
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          outlineColor: "rgba(255,255,255,0.8)",
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Column 3 — Important Links */}
            <div>
              <h3
                className="text-sm font-bold mb-4 pb-2 border-b"
                style={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                গুরুত্বপূর্ণ সেবা
              </h3>
              <nav aria-label="গুরুত্বপূর্ণ সেবা">
                <ul className="space-y-2" role="list">
                  {importantLinks.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 rounded"
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          outlineColor: "rgba(255,255,255,0.8)",
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Column 4 — Contact */}
            <div>
              <h3
                className="text-sm font-bold mb-4 pb-2 border-b"
                style={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                যোগাযোগ
              </h3>

              <address className="not-italic space-y-3">
                {/* Address */}
                <div>
                  <p
                    className="text-xs mb-1 font-semibold uppercase tracking-wide"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    ঠিকানা
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    হোল্ডিং - ২০৫, কাজলার পাড়,<br />
                    যাত্রাবাড়ী, ঢাকা - ১২৩৬
                  </p>
                </div>

                {/* Email */}
                <div>
                  <p
                    className="text-xs mb-1 font-semibold uppercase tracking-wide"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    ইমেইল
                  </p>
                  <a
                    href="mailto:wifaqbd@gmail.com"
                    className="text-sm hover:text-white transition-colors"
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: "var(--font-english)",
                    }}
                  >
                    wifaqbd@gmail.com
                  </a>
                </div>

                {/* Key phones */}
                <div>
                  <p
                    className="text-xs mb-2 font-semibold uppercase tracking-wide"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    জরুরি নম্বর
                  </p>
                  <ul className="space-y-1.5" role="list">
                    {departments.map((dept) => (
                      <li key={dept.phone}>
                        <p
                          className="text-xs"
                          style={{ color: "rgba(255,255,255,0.55)" }}
                        >
                          {dept.name}
                        </p>
                        <a
                          href={`tel:${dept.phone.replace(/[^0-9+]/g, "")}`}
                          className="text-sm hover:text-white transition-colors"
                          style={{
                            color: "rgba(255,255,255,0.85)",
                            fontFamily: "var(--font-english)",
                          }}
                        >
                          {dept.phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom copyright band ─────────────────────────── */}
      <div
        className="w-full py-4"
        style={{ backgroundColor: "var(--color-primary-dark)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p
              className="text-xs text-center sm:text-left"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              © {currentYear} বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।
            </p>
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Befaqul Madarisil Arabia Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}