"use client";

import { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from 'zod';
import { Input } from "@/src/components/ui/input";
import { ButtonLoading } from "@/src/components/ui/button";
import { ErrorMessage } from "@/src/components/ui/form";
import { apiClient } from "@/src/lib/axios";

// Zod 스키마 정의
const signUpSchema = z.object({
    email: z.string().email("유효한 이메일 주소를 입력해주세요."),
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"]
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: ""
        },
    });

    const onSubmit = async (data: SignUpFormValues) => {
        try {
            console.log('회원가입 요청 데이터:', {
                email: data.email,
                name: data.name,
                password: data.password
            });

            const response = await apiClient.post('/auth/signup', {
                email: data.email,
                name: data.name,
                password: data.password
            });

            console.log('회원가입 응답:', response);

            // 성공 시 로그인 페이지로 이동
            router.push('/login');
        } catch (error: any) {
            console.error('회원가입 전체 에러:', error);

            // 에러 처리
            setErrorMessage(
                error.response?.data?.message ||
                error.message ||
                '회원가입에 실패했습니다.'
            );
        }
    };

    return (
        <main className="relative grid h-screen place-content-center">
            <div className="z-10 rounded-lg bg-[#0404094F] p-10 shadow-xl w-[450px] backdrop-blur-sm">
                <div className="mb-8 text-center">
                    <p className="text-[36px] font-bold tracking-wider text-[#839abf]">ANSIM MAP</p>
                    <p className="text-white opacity-80">회원가입</p>
                </div>

                {errorMessage && (
                    <div className="mb-4 text-red-500 text-center">
                        {errorMessage}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-sm bg-[#1e334e4d] px-2 py-1">
                        <Controller
                            control={control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-1">
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="이메일"
                                        className="h-14 bg-transparent text-white border-none focus-visible:ring-1"
                                    />
                                    <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                                </div>
                            )}
                        />
                    </div>

                    <div className="rounded-sm bg-[#1e334e4d] px-2 py-1">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-1">
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="이름"
                                        className="h-14 bg-transparent text-white border-none focus-visible:ring-1"
                                    />
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
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="비밀번호"
                                        className="h-14 bg-transparent text-white border-none focus-visible:ring-1"
                                    />
                                    <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                                </div>
                            )}
                        />
                    </div>

                    <div className="rounded-sm bg-[#1e334e4d] px-2 py-1">
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-1">
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="비밀번호 확인"
                                        className="h-14 bg-transparent text-white border-none focus-visible:ring-1"
                                    />
                                    <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                                </div>
                            )}
                        />
                    </div>

                    <ButtonLoading
                        type="submit"
                        className="mt-6 h-14 w-full bg-blue-600 hover:bg-blue-500 text-lg font-bold"
                    >
                        회원가입
                    </ButtonLoading>

                    <div className="mt-4 text-center text-sm text-gray-300">
                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="hover:text-white hover:underline"
                        >
                            이미 계정이 있나요? 로그인
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}