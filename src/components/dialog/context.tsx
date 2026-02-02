// src/components/shared/dialog/context.tsx
"use client";

import React, { createContext, useState, ReactNode } from "react";
import { DialogOption, ConfirmOption, AlertDialog, ConfirmDialog } from "./type";
import CustomAlert from "./alert"; // 기존 컴포넌트를 확장하거나 새로 만듭니다.

interface DialogContextValue {
  alert: (message: string, option?: DialogOption) => Promise<void>;
  confirm: (message: string, option?: ConfirmOption) => Promise<boolean>;
}

export const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<AlertDialog | ConfirmDialog | null>(null);

  const alert = (message: string, option: DialogOption = {}): Promise<void> => {
    return new Promise((resolve) => {
      setDialog({
        type: "alert",
        message,
        option: {
          title: option.title || "알림",
          confirmText: option.confirmText || "확인",
          theme: option.theme || "info",
        },
        resolve: () => {
          setDialog(null);
          resolve();
        },
      });
    });
  };

  const confirm = (message: string, option: ConfirmOption = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        type: "confirm",
        message,
        option: {
          title: option.title || "확인",
          confirmText: option.confirmText || "확인",
          cancelText: option.cancelText || "취소",
          theme: option.theme || "info",
        },
        resolve: (result: boolean) => {
          setDialog(null);
          resolve(result);
        },
      });
    });
  };

  return (
    <DialogContext.Provider value={{ alert, confirm }}>
      {children}
      {dialog && (
        <CustomAlert 
          type={dialog.type}
          message={dialog.message} 
          title={dialog.option.title}
          confirmText={dialog.option.confirmText}
          cancelText={(dialog as ConfirmDialog).option.cancelText}
          theme={dialog.option.theme}
          onConfirm={() => dialog.resolve(true as any)}
          onCancel={() => (dialog as ConfirmDialog).resolve(false)}
        />
      )}
    </DialogContext.Provider>
  );
};