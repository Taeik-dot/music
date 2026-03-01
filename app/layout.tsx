import type { Metadata } from "next";
import { Geist, Geist_Mono, Pirata_One, Schoolbell } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 메인 대형 텍스트용 폰트
const pirataOne = Pirata_One({
  variable: "--font-pirata-one",
  weight: "400",
  subsets: ["latin"],
});

// 로고용 폰트
const schoolbell = Schoolbell({
  variable: "--font-schoolbell",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music App",
  description: "Music App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pirataOne.variable} ${schoolbell.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
