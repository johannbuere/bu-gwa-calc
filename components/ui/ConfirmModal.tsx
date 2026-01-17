"use client";

import { X } from "lucide-react";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl border-2 border-black w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b-2 border-black bg-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-black">Confirmation</h3>
            <button onClick={onCancel} className="p-1 hover:bg-gray-200 rounded-full transition-colors font-bold border border-transparent hover:border-black">
                <X size={20} />
            </button>
        </div>
        
        <div className="p-8 text-center">
            <p className="text-lg text-gray-800 font-medium">{message}</p>
        </div>
        
        <div className="p-6 bg-gray-50 border-t-2 border-black flex gap-4">
            <button 
                onClick={onCancel}
                className="flex-1 py-3 bg-white hover:bg-gray-100 text-black font-bold rounded-lg border-2 border-black hover:translate-y-0.5 transition-all active:translate-y-1"
            >
                Cancel
            </button>
            <button 
                onClick={onConfirm}
                className="flex-1 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-lg border-2 border-transparent hover:translate-y-0.5 transition-all"
            >
                Confirm
            </button>
        </div>
      </div>
    </div>
  );
}
