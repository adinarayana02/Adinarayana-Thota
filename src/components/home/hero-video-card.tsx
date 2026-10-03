"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Video, Sparkles, ExternalLink, RefreshCw } from "lucide-react";

interface HeroVideoCardProps {
  driveFileId?: string;
  driveViewUrl?: string;
  posterSrc?: string;
}

export function HeroVideoCard({
  driveFileId = "1Lirn5Ft7bji27Nd3K3W8tWzUQztmHr4g",
  driveViewUrl = "https://drive.google.com/file/d/1Lirn5Ft7bji27Nd3K3W8tWzUQztmHr4g/view?usp=sharing",
  posterSrc = "/adinarayana-hero.jpg",
}: HeroVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const embedUrl = `https://drive.google.com/file/d/${driveFileId}/preview`;

  const handleStartPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  const handleReload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIframeKey((prev) => prev + 1);
  };

  return (
    <motion.div
      className="hero-art-card group relative overflow-hidden select-none"
      aria-label="Adinarayana Thota Self Introduction Video"
      role="region"
      initial={{ y: 18, rotate: 1.2 }}
      animate={{ y: 0, rotate: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background Poster Image (shown before playback or as fallback) */}
      <img
        src={posterSrc}
        alt="Adinarayana Thota"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ zIndex: 1 }}
      />

      {/* Embedded Google Drive Video Player */}
      {isPlaying && (
        <div className="absolute inset-0 w-full h-full bg-black" style={{ zIndex: 2 }}>
          <iframe
            key={iframeKey}
            src={embedUrl}
            title="Adinarayana Thota - Self Introduction Video"
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Dark overlay gradient for contrast (hidden during video play to allow full interaction) */}
      {!isPlaying && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50 transition-opacity duration-300 group-hover:from-black/80 group-hover:via-black/20"
          style={{ zIndex: 3 }}
        />
      )}

      {/* Top Header Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-auto" style={{ zIndex: 4 }}>
        <div className="hero-art-card__label !static !m-0 flex items-center gap-2 bg-black/70 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-white shadow-lg">
          <Video size={13} className={isPlaying ? "text-emerald-400 animate-pulse" : "text-blue-400"} />
          <span className="font-mono text-xs font-semibold tracking-wider uppercase">
            {isPlaying ? "Self Intro • Playing" : "Self Introduction Video"}
          </span>
          {isPlaying && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {isPlaying && (
            <button
              onClick={handleReload}
              title="Reload video"
              className="p-1.5 rounded-full bg-black/70 border border-white/20 text-white/80 hover:text-white hover:bg-black/90 transition-colors backdrop-blur-md cursor-pointer"
            >
              <RefreshCw size={13} />
            </button>
          )}

          <a
            href={driveViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Drive"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 rounded-full bg-black/70 border border-white/20 px-3 py-1.5 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/90 transition-colors font-mono text-xs font-medium shadow-lg cursor-pointer"
          >
            <ExternalLink size={12} className="text-blue-400" />
            <span className="hidden sm:inline text-[11px]">Drive Link</span>
          </a>
        </div>
      </div>

      {/* Center Play Button Overlay (when not playing) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
            style={{ zIndex: 4 }}
            onClick={handleStartPlay}
          >
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-black/70 px-6 py-5 border border-white/20 backdrop-blur-xl shadow-2xl text-white transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/40">
                <Play size={24} className="translate-x-0.5 fill-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold tracking-wide">Click to Play Intro Video</p>
                <p className="text-[11px] text-white/70 font-mono mt-0.5">Streamed via Google Drive</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Caption (when not playing) */}
      {!isPlaying && (
        <div
          className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 rounded-2xl bg-black/75 p-4 border border-white/15 backdrop-blur-xl text-white shadow-xl pointer-events-auto"
          style={{ zIndex: 4 }}
          onClick={handleStartPlay}
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
          </div>
        </div>
      )}
    </motion.div>
  );
}
