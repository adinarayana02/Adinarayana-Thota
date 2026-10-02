"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Video, Sparkles, Volume2 } from "lucide-react";

interface HeroVideoCardProps {
  videoSrc?: string;
  posterSrc?: string;
}

export function HeroVideoCard({
  videoSrc = "/adinarayana-self-intro.mp4",
  posterSrc = "/adinarayana-hero.jpg",
}: HeroVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const startPlayingWithAudio = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // If the browser policy strictly blocks audio before user interaction,
        // retry with muted or wait for user click
        console.debug("Unmuted autoplay restricted by browser policy:", err);
      });
    }
  };

  const handleMouseEnter = () => {
    startPlayingWithAudio();
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(console.error);
    } else {
      videoRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(curr);
    setProgress((curr / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <motion.div
      className="hero-art-card group cursor-pointer relative overflow-hidden select-none"
      aria-label="Adinarayana Thota Self Introduction Video"
      role="region"
      initial={{ y: 18, rotate: 1.2 }}
      animate={{ y: 0, rotate: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={togglePlay}
    >
      {/* Background Video - unmuted by default */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        preload="metadata"
        playsInline
        muted={false}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        style={{ zIndex: 1 }}
      />

      {/* Dark overlay gradients for contrast and readability */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 transition-opacity duration-300 group-hover:from-black/75 group-hover:via-black/10 group-hover:to-black/30"
        style={{ zIndex: 2 }}
      />

      {/* Top Header Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2" style={{ zIndex: 3 }}>
        <div className="hero-art-card__label !static !m-0 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-white shadow-lg">
          <Video size={13} className={isPlaying ? "text-emerald-400 animate-pulse" : "text-blue-400"} />
          <span className="font-mono text-xs font-semibold tracking-wider uppercase">
            {isPlaying ? "Self Intro • Voice Active" : "Self Introduction Video"}
          </span>
          {isPlaying && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </div>

        {isPlaying && (
          <div className="flex items-center gap-1.5 rounded-full bg-black/60 border border-white/20 px-3 py-1.5 backdrop-blur-md text-emerald-400 font-mono text-xs font-medium shadow-lg animate-pulse">
            <Volume2 size={13} />
            <span className="hidden sm:inline text-[11px] text-white/90">Audio On</span>
          </div>
        )}
      </div>

      {/* Center Play Button Overlay (when paused) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            style={{ zIndex: 3 }}
          >
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-black/60 px-5 py-4 border border-white/20 backdrop-blur-xl shadow-2xl text-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/30">
                <Play size={24} className="translate-x-0.5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold tracking-wide">Hover to play with voice</p>
                <p className="text-[11px] text-white/70 font-mono mt-0.5">or click to toggle playback</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Caption & Video Timeline */}
      <div
        className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 rounded-2xl bg-black/65 p-4 border border-white/15 backdrop-blur-xl text-white shadow-xl"
        style={{ zIndex: 3 }}
      >
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-blue-300">
              <Sparkles size={12} />
              <span>Adinarayana Thota</span>
            </div>
            <h3 className="mt-1 text-sm md:text-base font-bold text-white tracking-tight leading-snug">
              AI Engineer & Full-Stack Developer
            </h3>
            <p className="mt-0.5 text-xs text-white/70 line-clamp-1">
              Building Multi-Agent Architectures, RAG Pipelines & High-Scale Systems.
            </p>
          </div>

          <div className="shrink-0 text-right font-mono text-[11px] text-white/60">
            {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "--:--"}
          </div>
        </div>

        {/* Video progress indicator */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
