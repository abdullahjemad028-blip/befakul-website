import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "যোগাযোগ | বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  description:
    "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের ঠিকানা, ফোন নম্বর ও ইমেইল তথ্য।",
};

const departments = [
  {
    id: 1,
    name: "মাদরাসা রেজিস্ট্রেশন (ইলহাক) ও ডাক শাখা",
    phones: ["০১৯৭৭৫০৫০৫৭"],
    email: null,
  },
  {
    id: 2,
    name: "তা'লিম তরবিয়াত (মাদরাসা পরিদর্শন) বিভাগ",
    phones: ["০১৭২৫৮৩৭১১৫", "০২৭৫৫৪০৬৫"],
    email: null,
  },
  {
    id: 3,
    name: "পরীক্ষা নিয়ন্ত্রণ বিভাগ",
    phones: ["০১৭১৬২৯৯৪৪৪"],
    email: null,
  },
  {
    id: 4,
    name: "পরীক্ষা নিয়ন্ত্রক",
    phones: ["০১৮৭৭৩৮৫৯৪৬"],
    email: null,
  },
  {
    id: 5,
    name: "হিসাব বিভাগ",
    phones: ["০১৮৭৭৩৮৫৯৪৯"],
    email: null,
  },
  {
    id: 6,
    name: "প্রকাশনা বিভাগ",
    phones: ["০১৭৯৮২৮৮৩৯২"],
    email: null,
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
                className="hover:underline"
                style={{ outlineColor: "var(--color-primary)" }}
              >
                হোম
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-gray-800 font-medium" aria-current="page">
              যোগাযোগ
            </li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="mb-10 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">যোগাযোগ</h1>
          <p className="text-base text-gray-600 mt-2">
            বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের বিভাগসমূহের সাথে যোগাযোগের তথ্য।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Head Office */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div
                className="px-5 py-4"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <h2 className="text-base font-bold text-white">প্রধান কার্যালয়</h2>
              </div>
              <div className="px-5 py-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    স্থায়ী ঠিকানা
                  </p>
                  <address className="not-italic text-sm text-gray-700 leading-relaxed">
                    হোল্ডিং - ২০৫, কাজলার পাড় (ভাঙ্গাপ্রেস),
                    <br />
                    যাত্রাবাড়ী, ঢাকা - ১২৩৬
                  </address>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    ইমেইল
                  </p>
                  <a
                    href="mailto:wifaqbd@gmail.com"
                    className="text-sm hover:underline focus-visible:outline focus-visible:outline-2 rounded"
                    style={{
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-english)",
                      outlineColor: "var(--color-primary)",
                    }}
                  >
                    wifaqbd@gmail.com
                  </a>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    অফিস সময়
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    শনিবার — বৃহস্পতিবার
                    <br />
                    সকাল ৯টা — বিকাল ৫টা
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                title="বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ — অবস্থান"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.5!2d90.4290!3d23.7104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJatrabari%2C+Dhaka!5e0!3m2!1sbn!2sbd!4v1"
                width="100%"
                height="220"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right — Department phones */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              বিভাগীয় যোগাযোগ নম্বর
            </h2>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead
                  style={{ backgroundColor: "var(--color-bg-section)" }}
                  className="border-b border-gray-200"
                >
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      বিভাগের নাম
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                      ফোন নম্বর
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800 font-medium leading-snug">
                        {dept.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {dept.phones.map((phone) => (
                            <a
                              key={phone}
                              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                              className="hover:underline focus-visible:outline focus-visible:outline-2 rounded"
                              style={{
                                color: "var(--color-primary)",
                                fontFamily: "var(--font-english)",
                                outlineColor: "var(--color-primary)",
                              }}
                            >
                              {phone}
                            </a>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note */}
            <div
              className="mt-4 p-4 rounded-lg border border-gray-200 text-sm text-gray-600 leading-relaxed"
              style={{ backgroundColor: "var(--color-bg-section)" }}
            >
              <span className="font-semibold text-gray-800">দ্রষ্টব্য:</span>{" "}
              অফিসিয়াল কার্যক্রম ও পরীক্ষা সংক্রান্ত তথ্যের জন্য সরাসরি
              সংশ্লিষ্ট বিভাগে যোগাযোগ করুন। ইমেইলে সাড়া পেতে ২–৩
              কার্যদিবস সময় লাগতে পারে।
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}