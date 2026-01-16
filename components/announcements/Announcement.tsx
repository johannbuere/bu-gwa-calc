"use client";

import Image from "next/image";
import { useState } from "react";

export default function Announcement() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-start w-full max-w-4xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-t-xl rounded-b-xl bg-secondary py-1.5 px-4 text-white hover:bg-opacity-90 transition-all mb-2"
      >
        <Image
          src="/icons/bx--notification.svg"
          alt="Notifications Icon"
          width={20}
          height={20}
        />
        <span className="text-sm font-semibold">Announcements</span>
        <Image
          src="/icons/nav-arrow-down.svg"
          alt="Toggle"
          width={16}
          height={16}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div style={{ background: 'linear-gradient(90deg, #2193CC 0%, #5AC8FF 100%)' }} className="relative w-full rounded-xl p-4 sm:p-6 text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 hover:opacity-75 transition-opacity"
            aria-label="Close"
          >
            <Image
              src="/icons/close-icon.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </button>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="shrink-0 mt-1">
              <Image
                src="/icons/info.svg"
                alt="Info"
                width={28}
                height={28}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Features Update</h3>
              <p className="text-white/90 leading-relaxed text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
