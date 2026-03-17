const responsibilities = [
  {
    id: 1,
    icon: "●",
    title: "কওমি মাদরাসা শিক্ষাক্রম তত্ত্বাবধান",
    description:
      "দেশের কওমি মাদরাসাসমূহের শিক্ষাক্রম নির্ধারণ ও তার মানোন্নয়নে কার্যকর ভূমিকা পালন।",
  },
  {
    id: 2,
    icon: "●",
    title: "কেন্দ্রীয় পরীক্ষা পরিচালনা",
    description:
      "বার্ষিক কেন্দ্রীয় পরীক্ষা সুষ্ঠু ও নিরপেক্ষভাবে পরিচালনা এবং মূল্যায়ন নিশ্চিতকরণ।",
  },
  {
    id: 3,
    icon: "●",
    title: "পরীক্ষার ফলাফল প্রকাশ",
    description:
      "পরীক্ষা সমাপ্তির পর নির্ধারিত সময়ের মধ্যে সঠিক ও নির্ভরযোগ্য ফলাফল প্রকাশ।",
  },
  {
    id: 4,
    icon: "●",
    title: "মাদরাসা নিবন্ধন ও তথ্য সংরক্ষণ",
    description:
      "অধিভুক্ত মাদরাসাসমূহের নিবন্ধন প্রক্রিয়া পরিচালনা ও প্রাতিষ্ঠানিক তথ্য সংরক্ষণ।",
  },
  {
    id: 5,
    icon: "●",
    title: "শিক্ষাবিষয়ক নীতিমালা প্রণয়ন",
    description:
      "মাদরাসা শিক্ষার সামগ্রিক উন্নয়নে প্রয়োজনীয় নীতিমালা ও দিকনির্দেশনা প্রণয়ন।",
  },
  {
    id: 6,
    icon: "●",
    title: "ধর্মীয় ও নৈতিক শিক্ষার উন্নয়ন",
    description:
      "শিক্ষার্থীদের মধ্যে ইসলামি মূল্যবোধ, নৈতিকতা ও ধর্মীয় জ্ঞানের বিকাশে সহায়তা।",
  },
];

export default function CoreResponsibilitiesSection() {
  return (
    <section
      className="w-full py-12 md:py-16 bg-white"
      aria-labelledby="responsibilities-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2
          id="responsibilities-heading"
          className="text-2xl font-bold text-gray-900 mb-8"
          style={{ fontFamily: "var(--font-bangla)" }}
        >
          বোর্ডের মূল কার্যাবলি
        </h2>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="list"
        >
          {responsibilities.map((item) => (
            <li
              key={item.id}
              className="bg-white border border-gray-200 rounded p-5"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-1 text-sm shrink-0"
                  style={{ color: "var(--color-primary)" }}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div>
                  <h3
                    className="text-base font-semibold text-gray-900 mb-1 leading-snug"
                    style={{ fontFamily: "var(--font-bangla)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-gray-600 leading-relaxed"
                    style={{ fontFamily: "var(--font-bangla)" }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}