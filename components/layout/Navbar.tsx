import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 bg-white w-full top-0 z-50 border-b border-gray-200 shadow-md">
      <Link href="/">
        <Image
          src="/images/logo-horizontal.png"
          alt="BU GWA Calculator Logo"
          width={150}
          height={50}
          priority
          className="h-auto w-auto"
        />
      </Link>

      <div className="flex flex-row items-center gap-2">
        <Link
          href="/"
          className="text-foreground text-sm font-normal px-4 py-2"
        >
          Calculator
        </Link>
        <Link
          href="/about"
          className="text-foreground text-sm font-normal px-4 py-2"
        >
          About
        </Link>
        <Link
          href="/roadmap"
          className="text-foreground text-sm font-normal px-4 py-2"
        >
          Roadmap
        </Link>

        {/* Theme Toggle Slider */}
        <button
          className="relative w-16 h-8 bg-foreground rounded-full ml-4"
          aria-label="Toggle theme"
        >
          <div className="absolute left-1 top-1 w-6 h-6 bg-background rounded-full flex items-center justify-center transition-transform">
            <Image
              src="/icons/ph--sun-light.svg"
              alt="Light mode"
              width={16}
              height={16}
            />
          </div>
        </button>
      </div>
    </nav>
  );
}
