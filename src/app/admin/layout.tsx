import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader />
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg-section)" }}>
        {children}
      </div>
    </>
  );
}