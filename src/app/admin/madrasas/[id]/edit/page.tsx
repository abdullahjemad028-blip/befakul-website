import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import MadrasaForm from "@/components/admin/MadrasaForm";
import { prisma } from "@/lib/prisma";

export default async function EditMadrasaPage({
  params,
}: {
  params: { id: string };
}) {
  const madrasa = await prisma.madrasa.findFirst({
    where: { id: params.id, deletedAt: null },
    select: {
      id:              true,
      name_bn:         true,
      registrationNo:  true,
      district:        true,
      division:        true,
      establishedYear: true,
      isActive:        true,
    },
  });

  if (!madrasa) notFound();

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "var(--font-bangla)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link
            href="/admin/madrasas"
            className="text-sm hover:underline mb-3 inline-block"
            style={{ color: "var(--color-primary)" }}
          >
            {"← মাদ্রাসা তালিকায় ফিরুন"}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">মাদ্রাসা সম্পাদনা</h1>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-8">
          <MadrasaForm
            initialData={{
              id:              madrasa.id,
              name_bn:         madrasa.name_bn,
              registrationNo:  madrasa.registrationNo,
              district:        madrasa.district,
              division:        madrasa.division,
              establishedYear: madrasa.establishedYear
                ? String(madrasa.establishedYear)
                : "",
              isActive: madrasa.isActive,
            }}
          />
        </div>
      </div>
    </div>
  );
}