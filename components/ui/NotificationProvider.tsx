"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Notification, { NotificationType, NotificationProps } from "./Notification";
import ConfirmModal from "./ConfirmModal";

interface ConfirmOptions {
  message: string;
  onConfirm: () => void;
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType) => void;
  confirmAction: (message: string, onConfirm: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Omit<NotificationProps, "onClose">[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmOptions | null>(null);

  const notify = (message: string, type: NotificationType = "info") => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const confirmAction = (message: string, onConfirm: () => void) => {
    setConfirmModal({ message, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmModal) {
      confirmModal.onConfirm();
      setConfirmModal(null);
    }
  };

  const handleCancel = () => {
    setConfirmModal(null);
  };

  return (
    <NotificationContext.Provider value={{ notify, confirmAction }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        {notifications.map((note) => (
          <div key={note.id} className="pointer-events-auto">
            <Notification {...note} onClose={removeNotification} />
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </NotificationContext.Provider>
  );
}
