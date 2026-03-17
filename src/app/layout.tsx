import Header from "@/components/layout/Header";
import type { Metadata } from "next";
import { solaimanLipi, notoSansBengali } from "./fonts";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
    template: "%s | বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  },
  description:
    "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ — কওমি মাদরাসা শিক্ষা বোর্ডের অফিসিয়াল ওয়েবসাইট। পরীক্ষার ফলাফল, নোটিশ বোর্ড এবং মাদরাসা সংক্রান্ত সকল তথ্য এখানে পাওয়া যায়।",
  keywords: [
    "বেফাকুল মাদারিসিল আরাবিয়া",
    "বেফাক",
    "কওমি মাদরাসা",
    "মাদরাসা শিক্ষা বোর্ড",
    "বাংলাদেশ মাদরাসা",
    "Befaqul Madarisil Arabia Bangladesh",
    "Befaq",
    "Quomi Madrasa",
    "Madrasa Education Board Bangladesh",
  ],
  authors: [{ name: "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ" }],
  creator: "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  publisher: "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  metadataBase: new URL("https://befaq.com.bd"),
  // Fix 3 — Canonical + language alternates
  alternates: {
    canonical: "https://befaq.com.bd",
    languages: {
      "bn-BD": "https://befaq.com.bd",
    },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://befaq.com.bd",
    siteName: "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
    title: "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
    description:
      "বাংলাদেশের কওমি মাদরাসা শিক্ষা বোর্ডের অফিসিয়াল ওয়েবসাইট।",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Fix 1 — Organization structured data (JSON-LD)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  alternateName: "Befaqul Madarisil Arabia Bangladesh",
  url: "https://befaq.com.bd",
  foundingDate: "1978",
  description:
    "বাংলাদেশের কওমি মাদরাসা শিক্ষাব্যবস্থার কেন্দ্রীয় তত্ত্বাবধায়ক বোর্ড",
  address: {
    "@type": "PostalAddress",
    streetAddress: "৩২, পুরানা পল্টন",
    addressLocality: "ঢাকা",
    postalCode: "1000",
    addressCountry: "BD",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@befaq.com.bd",
    contactType: "customer service",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      dir="ltr"
      className={`${solaimanLipi.variable} ${notoSansBengali.variable}`}
    >
      <body>

        <Header />

        
        {/* Fix 2 — <main> removed from layout; lives only in page.tsx */}
        {children}
        <Footer />
        {/* Fix 1 — JSON-LD injected globally, server-side, no client component */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>

    </html>
  );
}