import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "যোগাযোগ | বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  description:
    "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের সাথে যোগাযোগ করুন। ঠিকানা, ফোন নম্বর ও ইমেইল তথ্য এখানে পাওয়া যাবে।",
};

const contactInfo = [
  {
    id:    1,
    label: "ঠিকানা",
    value: "৩২, পুরানা পল্টন, ঢাকা — ১০০০, বাংলাদেশ",
    href:  null,
  },
  {
    id:    2,
    label: "ফোন",
    value: "+880-2-XXXXXXXX",
    href:  "tel:+8802XXXXXXXX",
  },
  {
    id:    3,
    label: "ইমেইল",
    value: "info@befaq.com.bd",
    href:  "mailto:info@befaq.com.bd",
  },
  {
    id:    4,
    label: "অফিস সময়",
    value: "শনিবার — বৃহস্পতিবার, সকাল ৯টা — বিকাল ৫টা",
    href:  null,
  },
];

export default function ContactPage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-bangla)" }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link
                href="/"
                className="hover:underline focus-visible:outline focus-visible:outline-2 rounded"
                style={{ outlineColor: "var(--color-primary)" }}
              >
                হোম
              </Link>
            </li>
            <li aria-hidden="true">{"›"}</li>
            <li className="text-gray-800 font-medium" aria-current="page">
              যোগাযোগ
            </li>
          </ol>
        </nav>

        {/* Page Heading */}
        <div className="mb-10 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            যোগাযোগ
          </h1>
          <p className="text-base text-gray-600 mt-2">
            যেকোনো তথ্য বা সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — Contact Details */}
          <section aria-labelledby="contact-details-heading">
            <h2
              id="contact-details-heading"
              className="text-xl font-bold text-gray-900 mb-6"
            >
              যোগাযোগের তথ্য
            </h2>

            <ul className="space-y-5" role="list">
              {contactInfo.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-4 border-b border-gray-100 pb-5 last:border-0"
                >
                  {/* Label */}
                  <span className="text-sm font-semibold text-gray-500 w-28 shrink-0 mt-0.5">
                    {item.label}
                  </span>

                  {/* Value */}
                  {item.href ? (
                    <a                   
                      href={item.href}
                      className="text-base text-gray-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
                      style={{
                        fontFamily:   item.id === 2 || item.id === 3
                          ? "var(--font-english)"
                          : "var(--font-bangla)",
                        outlineColor: "var(--color-primary)",
                      }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-base text-gray-800 leading-relaxed">
                      {item.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Right — Map Placeholder */}
          <section aria-labelledby="map-heading">
            <h2
              id="map-heading"
              className="text-xl font-bold text-gray-900 mb-6"
            >
              আমাদের অবস্থান
            </h2>

            {/* Google Map Embed */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <iframe
                title="বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ অফিসের অবস্থান"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.197!2d90.4152!3d23.7338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPuranan+Paltan%2C+Dhaka!5e0!3m2!1sbn!2sbd!4v1"
                width="100%"
                height="320"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <p className="text-sm text-gray-500 mt-3">
              ৩২, পুরানা পল্টন, ঢাকা — ১০০০
            </p>
          </section>

        </div>

        {/* Bottom Notice */}
        <div
          className="mt-12 p-5 rounded border border-gray-200"
          style={{ backgroundColor: "var(--color-bg-section)" }}
        >
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-800">দ্রষ্টব্য:</span>{" "}
            অফিসিয়াল কার্যক্রম ও পরীক্ষা সংক্রান্ত তথ্যের জন্য সরাসরি
            অফিসে যোগাযোগ করুন। ইমেইলে সাড়া পেতে ২–৩ কার্যদিবস সময় লাগতে পারে।
          </p>
        </div>

      </main>
    </div>
  );
}