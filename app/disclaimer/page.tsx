import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - BU GWA Calculator",
  description:
    "Important disclaimer and terms of use for BU GWA Calculator. Understand the limitations and proper use of this GWA calculation tool",

  keywords: [
    "Disclaimer",
    "Terms of Use",
    "BU GWA Calculator",
    "Bicol University",
    "GWA Calculator",
  ],

  openGraph: {
    title: "Disclaimer - BU GWA Calculator",
    description:
      "Important disclaimer and terms of use for BU GWA Calculator. Understand the limitations and proper use of this GWA calculation tool",
    url: "https://bu-gwa-calc.vercel.app/disclaimer",
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
    title: "Disclaimer - BU GWA Calculator",
    description:
      "Important disclaimer and terms of use for BU GWA Calculator. Understand the limitations and proper use of this GWA calculation tool",
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

export default function Disclaimer() {
  return (
    <div className="min-h-screen pt-16 pb-16 px-6 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-4xl font-bold text-foreground mb-6">Disclaimer</h1>
    </div>
  );
}
