import Announcement from "@/components/announcements/Announcement";
import GwaCalculator from "@/components/calculator/GwaCalculator";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 pt-24 sm:pt-32">
      <Announcement />
      <GwaCalculator />
    </div>
  );
}
