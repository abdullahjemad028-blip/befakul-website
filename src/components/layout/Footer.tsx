import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-gray-200 bg-white"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ── Column 1: About Board ── */}
          <div>
            <h2
              className="text-base font-semibold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-bangla)" }}
            >
              বেফাক সম্পর্কে
            </h2>
            <p
              className="text-sm text-gray-600 leading-relaxed"
              style={{ fontFamily: "var(--font-bangla)" }}
            >
              বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ দেশের কওমি মাদরাসা
              শিক্ষাব্যবস্থার কেন্দ্রীয় তত্ত্বাবধায়ক বোর্ড।
            </p>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div>
            <h2
              className="text-base font-semibold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-bangla)" }}
            >
              গুরুত্বপূর্ণ লিংক
            </h2>

            <ul className="space-y-2 text-sm" role="list">
              <li>
                <Link href="/about" className="hover:underline">
                  বোর্ড পরিচিতি
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:underline">
                  পরীক্ষার ফলাফল
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:underline">
                  নোটিশ বোর্ড
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Column 3: Contact Info ── */}
          <div>
            <h2
              className="text-base font-semibold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-bangla)" }}
            >
              যোগাযোগ
            </h2>

            <address
              className="not-italic text-sm text-gray-600 space-y-1"
              style={{ fontFamily: "var(--font-bangla)" }}
            >
              <p>ঢাকা, বাংলাদেশ</p>
              <p>ইমেইল: info@befaq.edu.bd</p>
              <p>ফোন: +880-XXXXXXXXX</p>
            </address>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p
            className="text-xs text-gray-500"
            style={{ fontFamily: "var(--font-bangla)" }}
          >
            © {new Date().getFullYear()} বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ —
            সর্বস্বত্ব সংরক্ষিত
          </p>
        </div>

      </div>
    </footer>
  );
}