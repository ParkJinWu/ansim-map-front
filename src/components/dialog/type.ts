export type DialogTheme = "info" | "warning";

export interface AlertOption {
  title?: string;
  confirmText?: string;
  theme?: DialogTheme;
}

export interface AlertDialog {
  message: string;
  option: Required<AlertOption>;
  resolve: () => void;
}