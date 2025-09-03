import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from '@vercel/analytics/next';
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

import {
  ClerkProvider
} from '@clerk/nextjs'

import { AlertDialogProvider } from "@/features/alert-dialog/context/alert-dialog-context";


const inter = Inter({
  subsets: ["latin", "vietnamese"],
})


export const metadata: Metadata = {
  // metadataBase: new URL("https://nextjs-seo-microbebm.vercel.app/"),
  title: {
    default: "Microbe BM - Giải pháp môi trường bền vững",
    template: "%s | Microbe BM",
  },
  description: "Microbe BM cung cấp dịch vụ môi trường trọn gói tại Việt Nam: xử lý nước, thiết bị, hóa chất, vi sinh - hướng đến tương lai xanh sạch bền vững.",
  openGraph: {
    type: "website",
    siteName: "Microbe BM",
    url: "https://nextjs-seo-microbebm.vercel.app/",
    title: "Microbe BM- Giải pháp môi trường bền vững",
    description: "Dịch vụ môi trường toàn diện: xử lý nước cấp/thải, khoan giếng, hóa chất, vi sinh. Giải pháp xanh - sạch - bền vững.",
  },
  other: {
    'google-site-verification': 'googlefe9181b003380b71.html',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
          <html lang="vi" className={inter.className}>
            <body
              suppressHydrationWarning
              >
              <AlertDialogProvider>
                {children}
                <Analytics />
              </AlertDialogProvider>
            </body>
          </html>
    </ClerkProvider>
  );
}
