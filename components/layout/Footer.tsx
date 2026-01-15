import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-6 py-12">
        {/* logo left, links right */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          {/* logo */}
          <div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Image
                  src="/images/logo-horizontal.png"
                  alt="BU GWA Calculator Logo"
                  width={250}
                  height={50}
                />
              </Link>
              <span className="text-primary text-sm font-bold">v0.2.1</span>
            </div>
            <p className="text-base text-gray-600 mt-2 mb-6">
              An open-source GWA calculator built for Bicol University students
              to easily compute their grades
            </p>
            <Link
              href="https://github.com/johannbuere/bu-gwa-calc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 bg-foreground text-white border border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
            >
              Contribute at
              <Image
                src="/icons/github-mark-white.svg"
                alt="GitHub"
                width={18}
                height={18}
              />
              GitHub
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col md:flex-row gap-4 md:gap-6">
            <Link href="/" className="text-foreground hover:text-primary">
              Calculator
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary">
              About
            </Link>
            <Link
              href="/disclaimer"
              className="text-foreground hover:text-primary"
            >
              Disclaimer
            </Link>
            <Link
              href="/roadmap"
              className="text-foreground hover:text-primary"
            >
              Roadmap
            </Link>
          </nav>
        </div>

        {/* Copyright and other links */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-250">© 2026 BU GWA Calculator</p>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/johannbuere/bu-gwa-calc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-250 hover:rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              <Image
                src="/icons/github-mark.svg"
                alt="GitHub"
                width={16}
                height={16}
              />
              GitHub
            </Link>

            <Link
              href="https://www.buymeacoffee.com/johannbuere"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                width={120}
                height={34}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
