import React from "react";

type Stat = {
  id:    number;
  value: string;
  label: string;
};

const stats: Stat[] = [
  {
    id:    1,
    value: "১৫,০০০+",
    label: "অধিভুক্ত মাদরাসা সংখ্যা",
  },
  {
    id:    2,
    value: "২৫ লক্ষ+",
    label: "মোট শিক্ষার্থী",
  },
  {
    id:    3,
    value: "১০+",
    label: "বার্ষিক অনুষ্ঠিত পরীক্ষা",
  },
  {
    id:    4,
    value: "১৯৭৮",
    label: "প্রতিষ্ঠাকাল",
  },
];

export default function StatsSection() {
  return (
    <section
      className="w-full py-12 md:py-16"
      style={{ backgroundColor: "var(--color-bg-section)" }}
      aria-labelledby="stats-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2
          id="stats-heading"
          className="text-2xl font-bold text-gray-900 mb-8 text-center"
          style={{ fontFamily: "var(--font-bangla)" }}
        >
          এক নজরে বেফাক
        </h2>

        <ul
          className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
          role="list"
        >
          {stats.map((stat) => (
            <li
              key={stat.id}
              className="rounded-lg bg-white px-4 py-6 text-center shadow-sm border border-gray-100"
            >
              {/* Number */}
              <p
                className="text-3xl sm:text-4xl font-bold leading-tight"
                style={{
                  color:      "var(--color-primary)",
                  fontFamily: "var(--font-bangla)",
                }}
                aria-label={`${stat.value} ${stat.label}`}
              >
                {stat.value}
              </p>

              {/* Label */}
              <p
                className="mt-2 text-sm sm:text-base text-gray-600 leading-snug"
                style={{ fontFamily: "var(--font-bangla)" }}
                aria-hidden="true"
              >
                {stat.label}
              </p>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}