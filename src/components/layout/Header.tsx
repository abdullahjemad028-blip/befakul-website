"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";   // ← ১. ইমেজ কম্পোনেন্ট ইম্পোর্ট

const navItems = [
  { label: "হোম", href: "/" },
  { label: "পরিচিতি", href: "/about" },
  { label: "ফলাফল", href: "https://wifaqresult.com/" },
  { label: "নোটিশ", href: "/notices" },
  { label: "মাদরাসা", href: "/madrasas" },
  { label: "যোগাযোগ", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white border-b border-gray-200"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* ── LEFT SIDE: Logo + Board Name ── */}
          <div className="flex items-center gap-3">
            {/* লোগো: প্লেসহোল্ডার ডিভ সরিয়ে ইমেজ বসানো হয়েছে */}
            <Image
              src="/images/befaq-logo.png"   // আপনার ইমেজের সঠিক পাথ দিন
              alt="বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ - লোগো"
              width={48}                      // 12 (Tailwind w-12) = 48px
              height={48}                     // 12 (Tailwind h-12) = 48px
              className="w-12 h-12 rounded-full object-cover shrink-0"
              priority                         // প্রয়োজনে প্রায়োরিটি দিন
            />

            <div className="leading-tight">
              <p className="text-base md:text-lg font-bold text-gray-900 leading-snug">
                বেফাকুল মাদারিসিল আরাবিয়া
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                বাংলাদেশ
              </p>
            </div>
          </div>

          {/* ── RIGHT SIDE: Desktop Navigation ── (অপরিবর্তিত) */}
          <nav aria-label="প্রধান নেভিগেশন" className="hidden md:block">
            <ul className="flex items-center gap-1" role="list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-[var(--color-primary)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                        "var(--color-primary)";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "white";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                        "";
                      (e.currentTarget as HTMLAnchorElement).style.color = "";
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── MOBILE: Hamburger Button ── (অপরিবর্তিত) */}
          <button
            type="button"
            className="md:hidden p-2 rounded text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={
              {
                "--tw-ring-color": "var(--color-primary)",
              } as React.CSSProperties
            }
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="sr-only">মেনু</span>
            <span
              className="block w-5 h-0.5 bg-current mb-1 transition-opacity"
              style={{ opacity: mobileMenuOpen ? 0 : 1 }}
            />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU (drops down) ── (অপরিবর্তিত) */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-200 bg-white"
          role="navigation"
          aria-label="মোবাইল নেভিগেশন"
        >
          <ul className="px-4 py-3 space-y-1" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 rounded text-base text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2"
                  style={
                    {
                      "--tw-ring-color": "var(--color-primary)",
                    } as React.CSSProperties
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}