'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

import { WorkspaceNavbar } from '@/components/workspace/WorkspaceNavbar';
import { PromptInputBox } from '@/components/workspace/PromptInputBox';

export default function WorkspacePage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 로그인하지 않은 사용자라면 /auth로 리다이렉트
    useEffect(() => {
        if (isMounted && !loading && !user) {
            router.push('/auth');
        }
    }, [user, loading, router, isMounted]);

    // CSR 환경에서 깜빡임 방지 (Hydration & Loading 갭)
    if (!isMounted || loading || !user) {
        return (
            <div
                className="min-h-screen w-full"
                style={{ backgroundColor: '#171717' }}
            />
        );
    }

    return (
        <div
            className="flex min-h-screen w-full flex-col font-sans text-white overflow-hidden"
            style={{ backgroundColor: '#171717' }}
        >
            {/* 상단 네비게이션 헤더 */}
            <WorkspaceNavbar user={user} signOut={signOut} />

            {/* 메인 콘텐츠 영역 (단순 구성) */}
            <main className="flex flex-grow flex-col items-center justify-center p-8 text-center pb-40 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-white/90">
                        Your Studio
                    </h1>
                    <p className="mx-auto max-w-md text-sm leading-relaxed text-white/50">
                        Start generating new music to pair with your videos perfectly.
                        Your generated tracks will appear here.
                    </p>
                </motion.div>

                {/* 하단 고정된 프롬프트 영역 */}
                <div className="fixed bottom-0 left-0 right-0 w-full flex justify-center pb-8 pt-10 bg-gradient-to-t from-[#171717] via-[#171717]/90 to-transparent pointer-events-none z-10 px-4">
                    <div className="w-full max-w-2xl pointer-events-auto">
                        <PromptInputBox
                            className="shadow-[0_0_40px_rgba(0,0,0,0.8)] border-transparent"
                            placeholder="Describe the sound you want to create..."
                            onSend={(msg: string) => console.log('Message sent:', msg)}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
