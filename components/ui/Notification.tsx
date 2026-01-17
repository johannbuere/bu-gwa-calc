"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type NotificationType = "success" | "error" | "info";

export interface NotificationProps {
  id: string;
  message: string;
  type: NotificationType;
  onClose: (id: string) => void;
}

export default function Notification({ id, message, type, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setIsVisible(true));
    
    // Auto close
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for exit animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-600" size={20} />,
    error: <AlertCircle className="text-red-600" size={20} />,
    info: <Info className="text-blue-600" size={20} />,
  };

  const borderColors = {
    success: "border-green-600",
    error: "border-red-600",
    info: "border-blue-600",
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 bg-white border-2 text-black rounded-lg min-w-[300px] max-w-md
        transition-all duration-300 transform 
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${borderColors[type]}
      `}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="flex-1 font-medium text-sm">{message}</p>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className="shrink-0 text-gray-400 hover:text-black transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}
