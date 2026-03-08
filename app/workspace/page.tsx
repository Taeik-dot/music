'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

import { WorkspaceNavbar } from '@/components/workspace/WorkspaceNavbar';
import { PromptInputBox } from '@/components/workspace/PromptInputBox';
import { MusicList, MusicItem } from '@/components/workspace/MusicList';
import LoadingLines from '@/components/workspace/LoadingLines';
import { MusicPlayer } from '@/components/workspace/MusicPlayer';
import { createClient } from '@/lib/supabase/client';

export default function WorkspacePage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [generatedMusic, setGeneratedMusic] = useState<MusicItem[]>([]);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const supabase = createClient();

    useEffect(() => {
        setIsMounted(true);
        if (user) {
            fetchMusicList();
        }
    }, [user]);

    const fetchMusicList = async () => {
        try {
            const { data, error } = await supabase
                .from('musics')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGeneratedMusic(data || []);
        } catch (error) {
            console.error('Error fetching music list:', error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    const handleGenerateMusic = async (prompt: string, options: { lyrics?: string; duration?: number; batch_size?: number }) => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setGenerationError(null);
        try {
            const response = await fetch('/api/music/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    ...options
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate music');
            }

            const newMusic = await response.json();

            // 만약 batch_size가 1보다 커서 배열이 돌아온다면 처리 필요
            if (Array.isArray(newMusic)) {
                setGeneratedMusic((prev) => [...newMusic, ...prev]);
            } else {
                setGeneratedMusic((prev) => [newMusic, ...prev]);
            }

        } catch (error: any) {
            console.error('Error generating music:', error);
            setGenerationError(error.message || 'An unexpected error occurred.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRenameTrack = async (id: string, newTitle: string) => {
        try {
            const { error } = await supabase
                .from('musics')
                .update({ title: newTitle })
                .eq('id', id);

            if (error) throw error;

            setGeneratedMusic((prev) =>
                prev.map((m) => (m.id === id ? { ...m, title: newTitle } : m))
            );
        } catch (error) {
            console.error('Error renaming track:', error);
            alert('Failed to rename track');
        }
    };

    const handleDeleteTrack = async (id: string) => {
        if (!confirm('Are you sure you want to delete this track?')) return;

        try {
            const trackToDelete = generatedMusic.find(m => m.id === id);

            // 1. DB 삭제
            const { error: dbError } = await supabase
                .from('musics')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // 2. Storage 삭제 (file_url에서 경로 추출 필요)
            if (trackToDelete?.file_url) {
                const urlParts = trackToDelete.file_url.split('/storage/v1/object/public/musics/');
                if (urlParts.length > 1) {
                    const filePath = urlParts[1];
                    await supabase.storage.from('musics').remove([filePath]);
                }
            }

            setGeneratedMusic((prev) => prev.filter((m) => m.id !== id));

            // 삭제한 트랙이 현재 재생 중이면 정지
            if (currentTrackId === id) {
                setIsPlaying(false);
                setCurrentTrackId(null);
            }
        } catch (error) {
            console.error('Error deleting track:', error);
            alert('Failed to delete track');
        }
    };

    const handleDownloadTrack = async (music: MusicItem) => {
        try {
            const response = await fetch(music.file_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${music.title || 'track'}.mp3`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading track:', error);
            alert('Failed to download track');
        }
    };

    const filteredMusic = generatedMusic.filter((m) => {
        const query = searchQuery.toLowerCase();
        return m.title.toLowerCase().includes(query) || (m.prompt && m.prompt.toLowerCase().includes(query));
    });

    const handlePlayTrack = (id: string) => {
        if (currentTrackId === id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentTrackId(id);
            setIsPlaying(true);
        }
    };

    const handleNextTrack = () => {
        const currentIndex = filteredMusic.findIndex((m) => m.id === currentTrackId);
        if (currentIndex !== -1 && currentIndex < filteredMusic.length - 1) {
            setCurrentTrackId(filteredMusic[currentIndex + 1].id);
            setIsPlaying(true);
        }
    };

    const handlePrevTrack = () => {
        const currentIndex = filteredMusic.findIndex((m) => m.id === currentTrackId);
        if (currentIndex > 0) {
            setCurrentTrackId(filteredMusic[currentIndex - 1].id);
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (isMounted && !authLoading && !user) {
            router.push('/auth');
        }
    }, [user, authLoading, router, isMounted]);

    if (!isMounted || authLoading || !user) {
        return (
            <div
                className="min-h-screen w-full"
                style={{ backgroundColor: '#171717' }}
            />
        );
    }

    return (
        <div
            className="flex min-h-screen w-full flex-col font-sans text-white"
            style={{ backgroundColor: '#171717' }}
        >
            <WorkspaceNavbar user={user} signOut={signOut} onSearch={setSearchQuery} />

            <main className="flex flex-grow flex-col items-center px-4 pt-6 pb-48 w-full max-w-[1200px] mx-auto">
                <div className={`w-full flex justify-center transition-all duration-300 ${isGenerating || generationError ? 'mb-6 min-h-[120px]' : 'h-0 overflow-hidden'}`}>
                    {isGenerating && <LoadingLines />}
                    {!isGenerating && generationError && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center text-red-500 gap-3 py-6"
                        >
                            <div className="rounded-full bg-red-500/10 p-4 border border-red-500/20">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-red-400">Failed to generate: {generationError}</span>
                        </motion.div>
                    )}
                </div>

                <MusicList
                    musics={filteredMusic}
                    isLoading={isInitialLoading}
                    currentTrackId={currentTrackId}
                    isPlaying={isPlaying}
                    onPlayTrack={handlePlayTrack}
                    onRenameTrack={handleRenameTrack}
                    onDeleteTrack={handleDeleteTrack}
                    onDownloadTrack={handleDownloadTrack}
                />

                <div className={`fixed ${currentTrackId ? 'bottom-[96px]' : 'bottom-0'} left-0 right-0 w-full flex justify-center pb-10 pt-12 bg-gradient-to-t from-[#171717] via-[#171717]/95 to-transparent pointer-events-none z-10 px-4 transition-all duration-300`}>
                    <div className="w-full max-w-2xl pointer-events-auto">
                        <PromptInputBox
                            className="shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-white/5"
                            placeholder={isGenerating ? "Processing..." : "e.g. A lo-fi beat for a rainy night study session"}
                            onSend={handleGenerateMusic}
                            isLoading={isGenerating}
                        />
                    </div>
                </div>

                <MusicPlayer
                    track={currentTrackId ? generatedMusic.find(m => m.id === currentTrackId) || null : null}
                    onNext={handleNextTrack}
                    onPrev={handlePrevTrack}
                    hasNext={(() => {
                        const idx = filteredMusic.findIndex(m => m.id === currentTrackId);
                        return idx !== -1 && idx < filteredMusic.length - 1;
                    })()}
                    hasPrev={(() => {
                        const idx = filteredMusic.findIndex(m => m.id === currentTrackId);
                        return idx > 0;
                    })()}
                    isPlaying={isPlaying}
                    onPlayPause={setIsPlaying}
                />
            </main>
        </div>
    );
}
