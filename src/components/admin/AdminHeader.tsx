import React from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const adminNavItems = [
  { label: "নোটিশ",   href: "/admin/notices"  },
  { label: "মাদ্রাসা", href: "/admin/madrasas" },
];

export default function AdminHeader() {
  return (
    <header
      className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm"
      style={{ fontFamily: "var(--font-bangla)" }}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Left — Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
              aria-hidden="true"
            >
              বেফাক
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-gray-900">
                অ্যাডমিন প্যানেল
              </p>
              <p className="text-xs text-gray-400">
                বেফাকুল মাদারিসিল আরাবিয়া
              </p>
            </div>
          </div>

          {/* Center — Nav Links */}
          <nav aria-label="অ্যাডমিন নেভিগেশন">
            <ul className="hidden sm:flex items-center gap-1" role="list">
              {adminNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="px-3 py-1.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ outlineColor: "var(--color-primary)" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">
            {/* Back to site */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block px-3 py-1.5 text-xs font-medium text-gray-500 rounded border border-gray-200 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2"
              style={{ outlineColor: "var(--color-primary)" }}
            >
              সাইট দেখুন ↗
            </Link>

            <LogoutButton />
          </div>

        </div>

        {/* Mobile Nav */}
        <div className="sm:hidden border-t border-gray-100 py-2">
          <ul className="flex items-center gap-1" role="list">
            {adminNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="px-3 py-1.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 block"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </header>
  );
}