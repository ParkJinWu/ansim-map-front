"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { DialogProvider } from "@/components/dialog/context";

export default function Providers({ children }: { children: React.ReactNode }) {
  // useState를 사용하여 클라이언트 사이드에서 단 한 번만 QueryClient가 생성되도록 합니다.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // 창을 다시 포커스했을 때 자동으로 새로고침되는 기능 등을 설정할 수 있습니다.
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <DialogProvider>
        {children}
      </DialogProvider>
    </QueryClientProvider>
  );
}