"use client";

import React, { createContext, useState, ReactNode } from "react";
import { AlertOption, AlertDialog } from "./type";
import CustomAlert from "./alert";

interface DialogContextValue {
  alert: (message: string, option?: AlertOption) => Promise<void>;
}

export const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<AlertDialog | null>(null);

  const alert = (message: string, option: AlertOption = {}): Promise<void> => {
    return new Promise((resolve) => {
      setDialog({
        message,
        option: {
          title: option.title || "알림",
          confirmText: option.confirmText || "확인",
          theme: option.theme || "info",
        },
        resolve: () => {
          setDialog(null); // 다이얼로그 닫기
          resolve();       // Promise 완료
        },
      });
    });
  };

  return (
    <DialogContext.Provider value={{ alert }}>
      {children}
      {dialog && (
        <CustomAlert 
          message={dialog.message} 
          title={dialog.option.title}
          confirmText={dialog.option.confirmText}
          theme={dialog.option.theme}
          onConfirm={dialog.resolve}
        />
      )}
    </DialogContext.Provider>
  );
};