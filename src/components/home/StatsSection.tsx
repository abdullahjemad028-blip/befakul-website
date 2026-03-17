type Stat = {
  id: number;
  value: string;
  label: string;
};

const stats: Stat[] = [
  {
    id: 1,
    value: "১৫,০০০+",
    label: "অধিভুক্ত মাদরাসা",
  },
  {
    id: 2,
    value: "২৫ লক্ষ+",
    label: "শিক্ষার্থী",
  },
  {
    id: 3,
    value: "১০+",
    label: "বার্ষিক পরীক্ষা",
  },
  {
    id: 4,
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
          className="text-xl font-semibold text-gray-800 mb-8 text-center"
          style={{ fontFamily: "var(--font-bangla)" }}
        >
            এক নজরে বেফাক
        </h2>

        <ul
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
          role="list"
        >
          {stats.map((stat) => (
            <li
              key={stat.id}
              className="text-center"
            >
              <p
                className="text-3xl md:text-4xl font-bold"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-bangla)",
                }}
                aria-label={`${stat.value} ${stat.label}`}
              >
                {stat.value}
              </p>
              <p
                className="mt-2 text-sm md:text-base text-gray-600"
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