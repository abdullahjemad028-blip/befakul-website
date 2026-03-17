export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import MadrasaSearchFilter from "@/components/madrasas/MadrasaSearchFilter";

export const metadata: Metadata = {
  title: "মাদ্রাসা তালিকা | বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  description:
    "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের অধিভুক্ত সকল মাদ্রাসার তালিকা। জেলা ও বিভাগ অনুযায়ী অনুসন্ধান করুন।",
};

interface Madrasa {
  id: string;
  name_bn: string;
  registrationNo: string;
  district: string;
  division: string;
}

interface MadrasaResponse {
  data: Madrasa[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type SearchParams = { [key: string]: string | string[] | undefined };

// ✅ FIXED fetch function (dynamic host)
async function fetchMadrasas(
  params: SearchParams
): Promise<MadrasaResponse | null> {
  try {
    const headersList = headers();
    const host = headersList.get("host"); // localhost:3001 / domain.com
    const protocol = host?.includes("localhost") ? "http" : "https";

    const baseUrl = `${protocol}://${host}`;

    const page = String(params.page ?? "1");
    const search = String(params.search ?? "");
    const division = String(params.division ?? "");
    const district = String(params.district ?? "");

    const query = new URLSearchParams();
    query.set("page", page);
    query.set("limit", "20");

    if (search) query.set("search", search);
    if (division) query.set("division", division);
    if (district) query.set("district", district);

    const res = await fetch(
      `${baseUrl}/api/madrasas?${query.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("API ERROR:", res.status);
      return null;
    }

    return (await res.json()) as MadrasaResponse;
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return null;
  }
}

export default async function MadrasasPage(props: {
  searchParams: SearchParams;
}) {
  const { searchParams } = props;
  const response = await fetchMadrasas(searchParams);

  const currentPage = parseInt(String(searchParams.page ?? "1"), 10);
  const currentSearch = String(searchParams.search ?? "");
  const currentDivision = String(searchParams.division ?? "");
  const currentDistrict = String(searchParams.district ?? "");

  function buildPageUrl(page: number): string {
    const params = new URLSearchParams();
    params.set("page", String(page));

    if (currentSearch) params.set("search", currentSearch);
    if (currentDivision) params.set("division", currentDivision);
    if (currentDistrict) params.set("district", currentDistrict);

    return `/madrasas?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-bangla)" }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:underline">
                হোম
              </Link>
            </li>
            <li>›</li>
            <li className="text-gray-800 font-medium">
              মাদ্রাসা তালিকা
            </li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            অধিভুক্ত মাদ্রাসা তালিকা
          </h1>
          <p className="text-base text-gray-600 mt-2">
            বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের অধিভুক্ত মাদ্রাসাসমূহ।
          </p>
        </div>

        {/* Filter */}
        <Suspense fallback={null}>
          <MadrasaSearchFilter />
        </Suspense>

        {/* Error */}
        {response === null && (
          <div className="py-16 text-center">
            <p className="text-red-500">
              ⚠️ API থেকে ডাটা লোড করা যায়নি
            </p>
          </div>
        )}

        {/* Data */}
        {response !== null && (
          <section>

            <p className="text-sm text-gray-500 mb-4">
              মোট <span className="font-semibold">{response.meta.total}</span> টি মাদ্রাসা
            </p>

            {response.data.length === 0 && (
              <div className="border rounded py-16 text-center">
                <p className="text-gray-500">
                  কোনো মাদ্রাসা পাওয়া যায়নি।
                </p>
              </div>
            )}

            {response.data.length > 0 && (
              <div className="border rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left">মাদ্রাসার নাম</th>
                        <th className="px-4 py-3 text-left">রেজিস্ট্রেশন</th>
                        <th className="px-4 py-3 text-left">জেলা</th>
                        <th className="px-4 py-3 text-left">বিভাগ</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {response.data.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <Link href={`/madrasas/${m.id}`} className="font-medium hover:underline">
                              {m.name_bn}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {m.registrationNo}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {m.district}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {m.division}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {response.meta.totalPages > 1 && (
              <div className="mt-8 flex justify-between items-center">
                {currentPage > 1 ? (
                  <Link href={buildPageUrl(currentPage - 1)}>
                    ← পূর্ববর্তী
                  </Link>
                ) : (
                  <span className="text-gray-300">← পূর্ববর্তী</span>
                )}

                <span>
                  পৃষ্ঠা {currentPage} / {response.meta.totalPages}
                </span>

                {currentPage < response.meta.totalPages ? (
                  <Link href={buildPageUrl(currentPage + 1)}>
                    পরবর্তী →
                  </Link>
                ) : (
                  <span className="text-gray-300">পরবর্তী →</span>
                )}
              </div>
            )}

          </section>
        )}
      </main>
    </div>
  );
}