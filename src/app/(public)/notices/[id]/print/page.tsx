import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategoryInfo } from "@/lib/notice-categories";

interface NoticeDetail {
  id:          string;
  title_bn:    string;
  body_bn:     string;
  publishedAt: Date | null;
  isPdf:       boolean;
  pdfUrl:      string | null;
  category:    string;
}

async function fetchNotice(id: string): Promise<NoticeDetail | null> {
  try {
    return await prisma.notice.findFirst({
      where: { id, isPublished: true, deletedAt: null },
      select: {
        id:          true,
        title_bn:    true,
        body_bn:     true,
        publishedAt: true,
        isPdf:       true,
        pdfUrl:      true,
        category:    true,
      },
    });
  } catch {
    return null;
  }
}

function formatDateBangla(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("bn-BD", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatDateEnglish(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function NoticePrintPage({
  params,
}: {
  params: { id: string };
}) {
  const notice = await fetchNotice(params.id);
  if (!notice) notFound();

  const catInfo = getCategoryInfo(notice.category);

  return (
    <html lang="bn" dir="ltr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{notice.title_bn} — বেফাক</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            background: #f0f0f0;
            font-family: 'SolaimanLipi', 'Noto Sans Bengali', sans-serif;
          }

          /* ── Paper ── */
          .paper {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            background: white;
            padding: 20mm 18mm 20mm 20mm;
            box-shadow: 0 4px 24px rgba(0,0,0,0.15);
            position: relative;
          }

          /* ── Header ── */
          .header {
            border-bottom: 3px solid #006633;
            padding-bottom: 16px;
            margin-bottom: 24px;
            text-align: center;
          }

          .logo-circle {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background-color: #006633;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px auto;
            color: white;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .org-name-bn {
            font-size: 22px;
            font-weight: 700;
            color: #006633;
            line-height: 1.3;
            margin-bottom: 4px;
          }

          .org-name-en {
            font-size: 12px;
            color: #444;
            font-family: Georgia, serif;
            letter-spacing: 0.3px;
            margin-bottom: 4px;
          }

          .org-address {
            font-size: 11px;
            color: #666;
          }

          /* ── Notice label bar ── */
          .notice-bar {
            background-color: #006633;
            color: white;
            text-align: center;
            padding: 8px 16px;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 24px;
            border-radius: 2px;
          }

          /* ── Meta row ── */
          .meta-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            font-size: 12px;
            color: #555;
          }

          .category-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            background: #f0faf4;
            color: #006633;
            border: 1px solid #b7dfc8;
          }

          .date-block {
            text-align: right;
          }

          .date-bn {
            font-size: 13px;
            color: #333;
            font-weight: 600;
            display: block;
          }

          .date-en {
            font-size: 11px;
            color: #888;
            display: block;
            font-family: Georgia, serif;
          }

          /* ── Divider ── */
          .divider {
            border: none;
            border-top: 1px solid #ddd;
            margin: 0 0 20px 0;
          }

          /* ── Notice title ── */
          .notice-title {
            font-size: 18px;
            font-weight: 700;
            color: #111;
            line-height: 1.5;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px dashed #ccc;
          }

          /* ── Body ── */
          .notice-body {
            font-size: 14px;
            line-height: 2;
            color: #222;
            white-space: pre-wrap;
            text-align: justify;
          }

          /* ── Footer ── */
          .footer {
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }

          .signature-block {
            text-align: center;
          }

          .signature-line {
            width: 160px;
            border-top: 1px solid #333;
            margin-bottom: 6px;
          }

          .signature-label {
            font-size: 11px;
            color: #555;
          }

          .page-note {
            font-size: 10px;
            color: #aaa;
            font-family: Georgia, serif;
          }

          /* ── Watermark ── */
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 80px;
            font-weight: 900;
            color: rgba(0, 102, 51, 0.04);
            pointer-events: none;
            user-select: none;
            white-space: nowrap;
            font-family: 'Noto Sans Bengali', sans-serif;
          }

          /* ── Print media ── */
          @media print {
            html, body {
              background: white;
            }

            .paper {
              width: 100%;
              margin: 0;
              padding: 15mm 15mm 15mm 18mm;
              box-shadow: none;
              min-height: auto;
            }

            .no-print {
              display: none !important;
            }

            @page {
              size: A4;
              margin: 0;
            }
          }
        `}</style>
      </head>
      <body>

        {/* Print button — screen only */}
        <div
          className="no-print"
          style={{
            textAlign:  "center",
            padding:    "12px",
            background: "#f5f5f5",
          }}
        >
          <button
            onClick={() => {/* handled by parent window */}}
            style={{
              padding:         "8px 24px",
              backgroundColor: "#006633",
              color:           "white",
              border:          "none",
              borderRadius:    "4px",
              fontSize:        "14px",
              cursor:          "pointer",
              fontFamily:      "sans-serif",
            }}
            // eslint-disable-next-line react/no-unknown-property
            onclick="window.print()"
          >
            🖨 প্রিন্ট করুন
          </button>
          <span style={{ marginLeft: "12px", fontSize: "12px", color: "#888" }}>
            অথবা Ctrl+P চাপুন
          </span>
        </div>

        {/* Paper */}
        <div className="paper">

          {/* Watermark */}
          <div className="watermark">বেফাক</div>

          {/* Header */}
          <div className="header">
            <div className="logo-circle">বেফাক</div>
            <p className="org-name-bn">বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ</p>
            <p className="org-name-en">Befaqul Madarisil Arabia Bangladesh</p>
            <p className="org-address">৩২, পুরানা পল্টন, ঢাকা — ১০০০ | info@befaq.com.bd</p>
          </div>

          {/* Notice bar */}
          <div className="notice-bar">বিজ্ঞপ্তি / NOTICE</div>

          {/* Meta row */}
          <div className="meta-row">
            <span className="category-badge">{catInfo.label}</span>
            <div className="date-block">
              <span className="date-bn">
                তারিখ: {formatDateBangla(notice.publishedAt)}
              </span>
              <span className="date-en">
                {formatDateEnglish(notice.publishedAt)}
              </span>
            </div>
          </div>

          <hr className="divider" />

          {/* Title */}
          <h1 className="notice-title">{notice.title_bn}</h1>

          {/* Body */}
          <div className="notice-body">{notice.body_bn}</div>

          {/* Footer */}
          <div className="footer">
            <p className="page-note">
              befaq.com.bd
            </p>
            <div className="signature-block">
              <div className="signature-line" />
              <p className="signature-label">মহাসচিব</p>
              <p className="signature-label">বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ</p>
            </div>
          </div>

        </div>

      </body>
    </html>
  );
}