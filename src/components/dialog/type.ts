export type DialogTheme = "info" | "warning";

export interface DialogOption {
  title?: string;
  confirmText?: string;
  theme?: DialogTheme;
}

// confirm 전용 옵션
export interface ConfirmOption extends DialogOption {
  cancelText?: string;
}

export interface AlertOption {
  title?: string;
  confirmText?: string;
  theme?: DialogTheme;
}

export interface AlertDialog {
  type: "alert";
  message: string;
  option: Required<DialogOption>;
  resolve: () => void;
}

export interface ConfirmDialog {
  type: "confirm";
  message: string;
  option: Required<ConfirmOption>;
  resolve: (value: boolean) => void; // true(확인), false(취소) 반환
}