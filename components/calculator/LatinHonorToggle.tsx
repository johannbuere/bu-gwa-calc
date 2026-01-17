"use client";

interface LatinHonorToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export default function LatinHonorToggle({ isEnabled, onToggle }: LatinHonorToggleProps) {
  return (
    <div className="mt-12 mb-6">
      <h3 className="text-secondary font-medium mb-2">Want to compute your final GWA?</h3>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className={`w-14 h-8 rounded-full border-2 border-black relative transition-colors duration-200 ease-in-out focus:outline-none ${
            isEnabled ? 'bg-secondary' : 'bg-gray-200'
          }`}
          aria-label="Toggle Latin Honor Calculator"
        >
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-[-2px] w-8 h-8 bg-white border-2 border-black rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
              isEnabled ? 'translate-x-[26px]' : 'translate-x-0'
            }`}
          ></div>
        </button>
        <span
          className={`text-lg font-bold ${isEnabled ? 'text-secondary' : 'text-gray-500'}`}
        >
          Enable Latin Honor Calculator
        </span>
      </div>
    </div>
  );
}
