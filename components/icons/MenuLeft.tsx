type IconProps = {
  className?: string;
};

export default function MenuLeft({ className = "" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-6 h-6 ${className}`}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M4 6a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m0 12a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m1-7a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z"
      />
    </svg>
  );
}
