"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginFormValues } from "@/features/auth/schema";
import { useLoginMutation } from "@/features/auth/api";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/form";
import { useDialog } from "@/components/dialog/useDialog";

export default function LoginPage() {
  const { alert } = useDialog();
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onError: async () => {
        // 이제 진짜 이 예쁜 알림이 뜹니다!
        await alert("아이디 또는 비밀번호가 일치하지 않습니다.", {
          theme: "warning",
          title: "로그인 실패"
        });
      }
    });
  };

  return (
    <main className="relative grid h-screen place-content-center">
      {/* 배경 레이어 */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/bg_login.jpg" alt="bg" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[#4a49497a]" />
      </div>

      {/* 로그인 박스 */}
      <div className="z-10 rounded-lg bg-[#0404094F] p-10 shadow-xl w-[450px] backdrop-blur-sm">
        <div className="mb-8 text-center">
          <p className="text-[36px] font-bold tracking-wider text-[#839abf]">ANSIM MAP</p>
          <p className="text-white opacity-80">안심하고 이동하는 길찾기 서비스</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-sm bg-[#1e334e4d] px-2 py-1">
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Input {...field} type="email" placeholder="이메일" className="h-14 bg-transparent text-white border-none focus-visible:ring-1" />
                  <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                </div>
              )}
            />
          </div>

          <div className="rounded-sm bg-[#1e334e4d] px-2 py-1">
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Input {...field} type="password" placeholder="비밀번호" className="h-14 bg-transparent text-white border-none focus-visible:ring-1" />
                  <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                </div>
              )}
            />
          </div>

          <ButtonLoading
            type="submit"
            className="mt-6 h-14 w-full bg-blue-600 hover:bg-blue-500 text-lg font-bold"
            isLoading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          >
            SIGN IN
          </ButtonLoading>

          <div className="mt-4 flex justify-between text-sm text-gray-300">
            <button type="button" onClick={() => router.push("/signup")} className="hover:text-white hover:underline">회원가입</button>
            <button type="button" className="hover:text-white hover:underline">비밀번호 찾기</button>
          </div>
        </form>
      </div>
    </main>
  );
}