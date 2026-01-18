import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - BU GWA Calculator",
  description:
    "Learn about BU GWA Calculator, an open-source tool designed to help Bicol University students calculate their General Weighted Average",

  keywords: [
    "About BU GWA Calculator",
    "Bicol University",
    "GWA Calculator",
    "Open Source",
    "Student Tools",
    "BU Students",
  ],

  openGraph: {
    title: "About - BU GWA Calculator",
    description:
      "Learn about BU GWA Calculator, an open-source tool designed to help Bicol University students calculate their General Weighted Average",
    url: "https://bu-gwa-calc.vercel.app/about",
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
    title: "About - BU GWA Calculator",
    description:
      "Learn about BU GWA Calculator, an open-source tool designed to help Bicol University students calculate their General Weighted Average",
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

export default function About() {
  return (
    <div className="min-h-screen pt-16 pb-16 px-6 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-4xl font-bold text-foreground mb-6">
        About BU GWA Calculator
      </h1>
    </div>
  );
}
