// src/components/shared/dialog/alert.tsx
"use client";

interface Props {
  type: "alert" | "confirm";
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  theme: "info" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CustomAlert({ type, title, message, confirmText, cancelText, theme, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in duration-200">
        <h3 className={`text-xl font-bold ${theme === 'warning' ? 'text-red-500' : 'text-sky-600'}`}>
          {title}
        </h3>
        <p className="mt-2 text-gray-600 whitespace-pre-wrap leading-relaxed">{message}</p>
        
        <div className="mt-6 flex gap-3">
          {/* confirm 타입일 때만 취소 버튼 표시 */}
          {type === "confirm" && (
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-500 hover:bg-gray-200 transition-all"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-3 font-bold text-white transition-all 
              ${theme === 'warning' ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-500 hover:bg-sky-600'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}