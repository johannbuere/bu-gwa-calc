"use client";

import { Copy } from "lucide-react";

interface HonorResult {
  title: string;
  color: string;
  message: string;
}

interface LatinHonorResultsProps {
  gwa: number;
  honor: HonorResult | null;
}

export default function LatinHonorResults({ gwa, honor }: LatinHonorResultsProps) {
  return (
    <div className="sticky top-8 z-20 bg-white rounded-xl border-2 border-primary shadow-[4px_4px_0px_0px_var(--primary)] p-6 sm:p-8 flex flex-col items-center text-center">
      <p className="text-secondary font-bold text-lg uppercase tracking-wide mb-2 self-start">
        Overall GWA
      </p>

      <div className="text-5xl sm:text-6xl font-black text-primary tracking-tighter mb-6 leading-none break-words w-full text-left">
        {gwa.toFixed(4)}
      </div>

      <div className="w-full h-0.5 bg-primary/10 mb-6"></div>

      <p className="text-secondary font-bold text-sm uppercase text-left tracking-wide mb-2 self-start">
        Latin Honor Qualification
      </p>

      {honor ? (
        <div className="flex flex-col items-start self-start text-left w-full">
          <h3
            className={`text-3xl sm:text-4xl font-black leading-tight ${honor.color} uppercase break-words w-full`}
          >
            {honor.title}
          </h3>
        </div>
      ) : (
        <div className="self-start text-left w-full">
          <h3 className="text-3xl sm:text-4xl font-black text-gray-300 uppercase break-words w-full">
            NO HONORS
          </h3>
        </div>
      )}

      <div className="mt-8 self-end w-full">
        <button
          onClick={() =>
            navigator.clipboard.writeText(
              `My GWA: ${gwa.toFixed(4)} - ${honor?.title || "No Honors"}`
            )
          }
          className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-primary border-2 border-primary text-primary hover:text-white p-3 rounded-lg transition-all font-bold group"
        >
          <Copy size={20} className="group-hover:text-white transition-colors" />
          Copy Result
        </button>
      </div>
    </div>
  );
}
