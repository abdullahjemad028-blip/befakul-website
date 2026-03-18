import { prisma } from "@/lib/prisma";
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface MadrasaDetail {
  id:              string;
  name_bn:         string;
  registrationNo:  string;
  district:        string;
  division:        string;
  establishedYear: number | null;
}

const BASE_URL  = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
const SITE_NAME = "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ";

async function fetchMadrasa(id: string) {
  try {
    return await prisma.madrasa.findFirst({
      where: { id, isActive: true, deletedAt: null },
      select: {
        id:              true,
        name_bn:         true,
        registrationNo:  true,
        district:        true,
        division:        true,
        establishedYear: true,
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const madrasa = await fetchMadrasa(params.id);
  if (!madrasa) return { title: `মাদ্রাসা পাওয়া যায়নি | ${SITE_NAME}` };

  return {
    title:       `${madrasa.name_bn} | ${SITE_NAME}`,
    description: `${madrasa.name_bn} — ${madrasa.district}, ${madrasa.division}। বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের অধিভুক্ত মাদ্রাসা।`,
  };
}

export default async function MadrasaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const madrasa = await fetchMadrasa(params.id);
  if (!madrasa) notFound();

  const details = [
    { label: "নাম",               value: madrasa.name_bn },
    { label: "রেজিস্ট্রেশন নম্বর", value: madrasa.registrationNo, english: true },
    { label: "জেলা",              value: madrasa.district },
    { label: "বিভাগ",             value: madrasa.division },
    {
      label: "প্রতিষ্ঠাকাল",
      value: madrasa.establishedYear
        ? String(madrasa.establishedYear)
        : "তথ্য নেই",
    },
  ];

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-bangla)" }}
    >
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:underline">হোম</Link>
            </li>
            <li aria-hidden="true">{"›"}</li>
            <li>
              <Link href="/madrasas" className="hover:underline">
                মাদ্রাসা তালিকা
              </Link>
            </li>
            <li aria-hidden="true">{"›"}</li>
            <li
              className="text-gray-800 font-medium truncate max-w-xs"
              aria-current="page"
            >
              {madrasa.name_bn}
            </li>
          </ol>
        </nav>

        {/* Detail Card */}
        <article
          className="border border-gray-200 rounded-lg px-6 py-8 md:px-10 md:py-10"
          aria-labelledby="madrasa-name"
        >
          <h1
            id="madrasa-name"
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 pb-6 border-b border-gray-200"
          >
            {madrasa.name_bn}
          </h1>

          <dl className="space-y-4">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
              >
                <dt className="text-sm font-semibold text-gray-500 w-40 shrink-0 mt-0.5">
                  {item.label}
                </dt>
                <dd
                  className="text-base text-gray-900"
                  style={{
                    fontFamily: item.english
                      ? "var(--font-english)"
                      : "var(--font-bangla)",
                  }}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </article>

        {/* Back */}
        <div className="mt-8">
          <Link
            href="/madrasas"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            {"← মাদ্রাসা তালিকায় ফিরুন"}
          </Link>
        </div>

      </main>
    </div>
  );
}