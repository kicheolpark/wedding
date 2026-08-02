import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: "박기철 & 정송이 결혼식에 초대합니다",
    description:
      "2026년 9월 20일, 박기철과 정송이의 소중한 시작에 초대합니다.",
    metadataBase: new URL(origin),
    openGraph: {
      title: "박기철 & 정송이 결혼식에 초대합니다",
      description: "2026년 9월 20일 일요일 낮 12시",
      type: "website",
      locale: "ko_KR",
      images: [
        {
          url: `${origin}/og.jpg`,
          width: 1200,
          height: 630,
          alt: "박기철 · 정송이 결혼식 초대장",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "박기철 & 정송이 결혼식에 초대합니다",
      description: "2026년 9월 20일 일요일 낮 12시",
      images: [`${origin}/og.jpg`],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fdfcf9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preload"
          as="image"
          href="/hero.jpg"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
