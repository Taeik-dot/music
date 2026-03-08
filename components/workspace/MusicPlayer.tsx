'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MusicItem {
    id: string;
    title: string;
    prompt: string;
    file_url: string;
    duration: number | null;
    created_at: string;
}

interface MusicPlayerProps {
    track: MusicItem | null;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
    isPlaying: boolean;
    onPlayPause: (playing: boolean) => void;
}

export function MusicPlayer({ track, onNext, onPrev, hasNext, hasPrev, isPlaying, onPlayPause }: MusicPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (track && audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error(e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [track, isPlaying]);

    const handlePlayPause = () => {
        if (!audioRef.current || !track) return;
        if (isPlaying) {
            audioRef.current.pause();
            onPlayPause(false);
        } else {
            audioRef.current.play();
            onPlayPause(true);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const bounds = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - bounds.left) / bounds.width;
        audioRef.current.currentTime = percent * duration;
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (audioRef.current) {
            audioRef.current.volume = val;
        }
        setIsMuted(val === 0);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        if (isMuted) {
            audioRef.current.volume = volume || 1;
            setIsMuted(false);
        } else {
            audioRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            {track && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 h-24 bg-black border-t border-white/10 z-50 flex items-center justify-between px-4 md:px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                >
                    <audio
                        ref={audioRef}
                        src={track.file_url}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={onNext}
                    />

                    {/* Left: Track Info */}
                    <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
                        <div className="h-14 w-14 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0 animate-pulse">
                            <Music className="h-6 w-6 text-white/50" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{track.title}</h4>
                            <p className="text-white/50 text-xs truncate max-w-[200px]">
                                {track.prompt}
                            </p>
                        </div>
                    </div>

                    {/* Center: Controls & Progress */}
                    <div className="flex flex-col items-center justify-center w-1/3 max-w-xl px-4 gap-2">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={onPrev}
                                disabled={!hasPrev}
                                className="text-white/60 hover:text-white disabled:opacity-30 disabled:hover:text-white/60 transition"
                            >
                                <SkipBack className="h-5 w-5 fill-current" />
                            </button>
                            <button
                                onClick={handlePlayPause}
                                className="h-9 w-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition"
                            >
                                {isPlaying ? (
                                    <Pause className="h-4 w-4 text-black fill-current" />
                                ) : (
                                    <Play className="h-4 w-4 text-black fill-current ml-0.5" />
                                )}
                            </button>
                            <button
                                onClick={onNext}
                                disabled={!hasNext}
                                className="text-white/60 hover:text-white disabled:opacity-30 disabled:hover:text-white/60 transition"
                            >
                                <SkipForward className="h-5 w-5 fill-current" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 w-full text-[11px] text-white/50 font-medium">
                            <span className="w-10 text-right">{formatTime(currentTime)}</span>
                            <div
                                className="h-1 flex-grow bg-white/10 rounded-full cursor-pointer group relative flex items-center"
                                onClick={handleProgressClick}
                            >
                                <div
                                    className="absolute left-0 h-1 bg-white group-hover:bg-[#1EAEDB] transition-colors rounded-full"
                                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                                />
                                <div
                                    className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                    style={{ left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 6px)` }}
                                />
                            </div>
                            <span className="w-10">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Right: Volume etc */}
                    <div className="flex items-center justify-end w-1/3 gap-3">
                        <button onClick={toggleMute} className="text-white/60 hover:text-white transition">
                            {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white hover:accent-[#1EAEDB]"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
