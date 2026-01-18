import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap - BU GWA Calculator",
  description:
    "Explore the development roadmap and upcoming features for BU GWA Calculator. See what's planned for future releases",

  keywords: [
    "Roadmap",
    "Future Features",
    "BU GWA Calculator",
    "Bicol University",
    "Development Plans",
  ],

  openGraph: {
    title: "Roadmap - BU GWA Calculator",
    description:
      "Explore the development roadmap and upcoming features for BU GWA Calculator. See what's planned for future releases",
    url: "https://bu-gwa.vercel.app/roadmap",
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
    title: "Roadmap - BU GWA Calculator",
    description:
      "Explore the development roadmap and upcoming features for BU GWA Calculator. See what's planned for future releases",
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

export default function Roadmap() {
  return (
    <div className="min-h-screen flex items-center pt-16 pb-16 px-6 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-4xl font-bold text-foreground mb-6">
        Roadmap is under construction
      </h1>
    </div>
  );
}
