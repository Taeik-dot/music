'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface WorkspaceNavbarProps {
    user: User | null;
    signOut: () => Promise<void>;
}

export function WorkspaceNavbar({ user, signOut }: WorkspaceNavbarProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const avatarUrl = user?.user_metadata?.avatar_url;
    const userName = user?.user_metadata?.full_name || user?.email || 'User';

    // 외부 클릭 시 프로필 메뉴 닫기 (접근성 및 편의)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="relative z-50 flex w-full items-center justify-between px-8 py-4 bg-transparent">
            {/* 1. 왼쪽: 로고 */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
            >
                <span
                    className="text-2xl tracking-widest text-white"
                    style={{ fontFamily: 'var(--font-schoolbell)' }}
                >
                    Music
                </span>
            </motion.div>

            {/* 2. 중앙: 검색창 (Liquid Glass) */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="hidden md:flex flex-1 max-w-md mx-8"
            >
                <div
                    className="relative w-full flex items-center rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] focus-within:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
                        backdropFilter: 'blur(20px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                        border: '1px solid rgba(255,255,255,0.15)',
                    }}
                >
                    {/* 상단 엣지 하이라이트 */}
                    <div
                        className="absolute inset-x-0 top-0 h-px pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 50%, transparent)',
                        }}
                    />
                    <div className="pl-4 pr-3 py-2.5 text-white/50 group-focus-within:text-white/80 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search your library..."
                        className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none py-2.5 pr-4"
                    />
                </div>
            </motion.div>

            {/* 3. 우측: 사용자 프로필 (Hover/Click) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center relative"
                ref={profileRef}
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
            >
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="relative flex items-center justify-center h-10 w-10 rounded-full overflow-hidden transition-transform duration-200 hover:scale-105 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}
                >
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                        <UserIcon size={20} className="text-white/80" />
                    )}
                </button>

                {/* 팝오버 메뉴 (Liquid Glass) */}
                <AnimatePresence>
                    {isProfileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-0 top-full mt-3 w-56 rounded-2xl overflow-hidden origin-top-right"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
                                backdropFilter: 'blur(30px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1) inset',
                            }}
                        >
                            {/* 상단 엣지 하이라이트 */}
                            <div
                                className="absolute inset-x-0 top-0 h-px"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4) 50%, transparent)',
                                }}
                            />

                            <div className="p-4 border-b border-white/10">
                                <p className="text-sm font-medium text-white truncate">{userName}</p>
                                <p className="text-xs text-white/50 truncate mt-0.5">{user?.email}</p>
                            </div>

                            <div className="p-2">
                                <button
                                    onClick={signOut}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-white/10 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </nav>
    );
}
