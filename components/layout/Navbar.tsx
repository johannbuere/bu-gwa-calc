import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  // generate rand patterns
  const patterns = ["+", "-", "×", "÷", "=", "√", "%", "²", "³", "∑"];
  const randomPatterns = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    symbol: patterns[Math.floor(Math.random() * patterns.length)],
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${15 + Math.random() * 10}s`,
  }));

  return (
    <nav className="relative flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 bg-navbg w-full top-0 z-50 border-b border-gray-200 shadow-md overflow-hidden">
      {/* bg calculation patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {randomPatterns.map((pattern) => (
          <span
            key={pattern.id}
            className="absolute text-2xl font-bold text-white/30 animate-float-horizontal"
            style={{
              top: `${Math.random() * 100}%`,
              animationDelay: pattern.animationDelay,
              animationDuration: pattern.animationDuration,
            }}
          >
            {pattern.symbol}
          </span>
        ))}
      </div>

      {/* navbar */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/images/logo-horizontal.png"
              alt="BU GWA Calculator Logo"
              width={150}
              height={50}
              priority
              className="h-8 w-auto md:h-12"
            />
          </Link>
          <span className="text-muted text-sm font-bold">v0.2.1</span>
        </div>

        <div className="flex flex-row items-center gap-2">
          <Link
            href="/"
            className="text-muted text-sm font-medium px-4 py-2 hover:rounded-lg hover:bg-muted hover:text-foreground"
          >
            Calculator
          </Link>
          <Link
            href="/about"
            className="text-muted text-sm font-medium px-4 py-2 hover:rounded-lg hover:bg-muted hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/disclaimer"
            className="text-muted text-sm font-medium px-4 py-2 hover:rounded-lg hover:bg-muted hover:text-foreground"
          >
            Disclaimer
          </Link>

          <Link
            href="/roadmap"
            className="text-muted text-sm font-medium px-4 py-2 hover:rounded-lg hover:bg-muted hover:text-foreground"
          >
            Roadmap
          </Link>

          <button
            className="relative w-16 h-8 bg-background rounded-full ml-4"
            aria-label="Toggle theme"
          >
            <div className="absolute left-1 top-1 w-6 h-6 bg-foreground rounded-full flex items-center justify-center transition-transform">
              <Image
                src="/icons/ph--sun-light.svg"
                alt="Light mode"
                width={16}
                height={16}
                className="invert"
              />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
