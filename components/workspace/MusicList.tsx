'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, Clock, Calendar, MessageSquare, MoreHorizontal, Pencil, Trash2, Download, Loader2 } from 'lucide-react';

export interface MusicItem {
    id: string;
    title: string;
    prompt: string;
    file_url: string;
    duration: number | null;
    created_at: string;
}

interface MusicListProps {
    musics: MusicItem[];
    isLoading: boolean;
    currentTrackId?: string | null;
    isPlaying?: boolean;
    onPlayTrack?: (id: string) => void;
    onDeleteTrack?: (id: string) => void;
    onRenameTrack?: (id: string, newTitle: string) => void;
    onDownloadTrack?: (music: MusicItem) => void;
}

export function MusicList({
    musics,
    isLoading,
    currentTrackId = null,
    isPlaying = false,
    onPlayTrack,
    onDeleteTrack,
    onRenameTrack,
    onDownloadTrack
}: MusicListProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    if (isLoading && musics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-white/20">
                <div className="h-12 w-12 border-2 border-t-white/40 border-white/5 rounded-full animate-spin mb-4" />
                <p>Loading your tracks...</p>
            </div>
        );
    }

    if (musics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-white/20 border-2 border-dashed border-white/5 rounded-3xl mt-4">
                <Music className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm font-medium">No tracks generated yet.</p>
                <p className="text-[11px] mt-1">Try describing a sound below to get started.</p>
            </div>
        );
    }

    const toggleMenu = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleRename = (id: string, currentTitle: string) => {
        const newTitle = prompt('Enter new title:', currentTitle);
        if (newTitle && newTitle !== currentTitle) {
            onRenameTrack?.(id, newTitle);
        }
        setOpenMenuId(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
                {musics.map((music, index) => (
                    <motion.div
                        key={music.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
                    >
                        {/* Play/Pause Button */}
                        <button
                            onClick={() => onPlayTrack?.(music.id)}
                            className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/20 transition-all duration-200 cursor-pointer z-10"
                        >
                            {currentTrackId === music.id && isPlaying ? (
                                <Pause className="h-4 w-4 fill-current" />
                            ) : (
                                <Play className="h-4 w-4 fill-current ml-0.5" />
                            )}
                        </button>

                        {/* Text Info */}
                        <div className="flex-grow min-w-0 space-y-0.5 relative z-10">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium text-sm text-white/90 truncate">{music.title}</h3>
                                {music.duration && (
                                    <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/40 font-medium">
                                        <Clock className="h-2.5 w-2.5" />
                                        {Math.floor(music.duration / 60)}:{(music.duration % 60).toString().padStart(2, '0')}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-white/40">
                                <div className="flex items-center gap-1 min-w-0">
                                    <MessageSquare className="h-3 w-3 flex-shrink-0" />
                                    <p className="truncate italic max-w-[200px] sm:max-w-md">"{music.prompt}"</p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0 border-l border-white/10 pl-3">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(music.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* More Options Menu */}
                        <div className="relative z-20 ml-auto flex-shrink-0">
                            <button
                                onClick={(e) => toggleMenu(e, music.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>

                            <AnimatePresence>
                                {openMenuId === music.id && (
                                    <>
                                        {/* Overlay to close menu */}
                                        <div
                                            className="fixed inset-0 z-30"
                                            onClick={() => setOpenMenuId(null)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute right-0 top-full mt-1 w-36 py-1 rounded-xl bg-neutral-900 border border-white/10 shadow-2xl z-40"
                                        >
                                            <button
                                                onClick={() => handleRename(music.id, music.title)}
                                                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                                Rename
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onDownloadTrack?.(music);
                                                    setOpenMenuId(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                Download
                                            </button>
                                            <div className="my-1 border-t border-white/5" />
                                            <button
                                                onClick={() => {
                                                    onDeleteTrack?.(music.id);
                                                    setOpenMenuId(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Visual Progress Highlight when playing */}
                        {currentTrackId === music.id && (
                            <motion.div
                                layoutId="active-indicator"
                                className="absolute left-0 top-1/4 h-1/2 w-1.5 bg-[#1EAEDB] rounded-r-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
