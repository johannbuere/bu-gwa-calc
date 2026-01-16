import Announcement from "@/components/announcements/Announcement";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 pt-24 sm:pt-32">
      <Announcement />
    </div>
  );
}
