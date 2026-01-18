import Announcement from "@/components/announcements/Announcement";
import GwaCalculator from "@/components/calculator/GwaCalculator";
import { Metadata } from "next";

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
    url: "https://bu-gwa-calc.vercel.app",
    siteName: "BU GWA Calculator",
    images: [
      {
        url: "https://bu-gwa-calc.vercel.app/images/bu-gwa-calc-og.png",
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
    images: ["https://bu-gwa-calc.vercel.app/images/bu-gwa-calc-og.png"],
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

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 pt-24 sm:pt-32">
      <Announcement />
      <GwaCalculator />
    </div>
  );
}
