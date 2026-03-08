import type { Metadata } from "next";
import { Geist, Geist_Mono, Pirata_One, Schoolbell } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
// ... (생략된 폰트 설정들)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pirataOne = Pirata_One({
  variable: "--font-pirata-one",
  weight: "400",
  subsets: ["latin"],
});

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
