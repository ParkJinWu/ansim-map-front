"use client";

import { DialogTheme } from "./type";

interface Props {
  title: string;
  message: string;
  confirmText: string;
  theme: DialogTheme;
  onConfirm: () => void;
}

export default function CustomAlert({ title, message, confirmText, theme, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className={`text-xl font-bold ${theme === 'warning' ? 'text-red-500' : 'text-blue-600'}`}>
          {title}
        </h3>
        <p className="mt-2 text-gray-600 whitespace-pre-wrap">{message}</p>
        <button
          onClick={onConfirm}
          className={`mt-6 w-full rounded-xl py-3 font-bold text-white transition-all 
            ${theme === 'warning' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}