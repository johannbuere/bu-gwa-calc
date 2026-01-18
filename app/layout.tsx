import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { NotificationProvider } from "@/components/ui/NotificationProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BU GWA Calculator - GWA Calculator for Bicol University Students",
  description:
    "An open-source web app for Bicol University students to quickly calculate their GWA",

  keywords: [
    "Bicol University",
    "GWA Calculator",
    "BU GWA Calculator",
    "GWA",
    "General Weighted Average",
    "Student Tools",
    "Open Source",
    "BU",
    "Calculator",
    "BU Students",
  ],

  openGraph: {
    title: "BU GWA Calculator - GWA Calculator for Bicol University Students",
    description:
      "An open-source web app for Bicol University students to quickly calculate their GWA",
    url: "https://bu-gwa.vercel.app",
    siteName: "BU GWA Calculator",
    images: [
      {
        url: "https://bu-gwa.vercel.app/images/bu-gwa-calc-og.png",
        width: 1200,
        height: 630,
        alt: "BU GWA Calculator Preview Image",
      },
    ],
    locale: "en-PH",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "BU GWA Calculator",
    description:
      "An open-source web app for Bicol University students to quickly calculate their GWA",
    images: ["https://bu-gwa.vercel.app/images/bu-gwa-calc-og.png"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <NotificationProvider>
          <Navbar />
          {children}
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  );
}
