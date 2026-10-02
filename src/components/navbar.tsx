"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Sun,
  Moon,
  Code2,
  Terminal,
  Volume2,
  VolumeX,
  Search,
  Command
} from "lucide-react";
import { navLinks, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { soundManager } from "@/lib/sounds";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
    setSoundEnabled(soundManager.isEnabled());
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleSound = () => {
    const next = soundManager.toggle();
    setSoundEnabled(next);
  };

  const openCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  };

  const openTerminal = () => {
    window.dispatchEvent(new CustomEvent("open-terminal-modal"));
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass shadow-lg shadow-black/5 dark:shadow-black/20"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => soundManager.playClick()}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Code2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-[family-name:var(--font-heading)] text-lg font-bold">
              {siteConfig.name.split(" ")[0]}
              <span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => soundManager.playClick()}
                  onMouseEnter={() => soundManager.playPop()}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Command Palette Trigger */}
            <button
              onClick={openCommandPalette}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/40 text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
              title="Open Command Palette (⌘K)"
            >
              <Search size={13} className="text-primary" />
              <span className="text-[11px] font-medium">Search</span>
              <kbd className="text-[9px] font-mono bg-background px-1.5 py-0.2 rounded border border-border/60">⌘K</kbd>
            </button>

            {/* Interactive Terminal Trigger */}
            <button
              onClick={openTerminal}
              className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors duration-200 border border-border/30"
              title="Launch Terminal (~)"
              aria-label="Launch Terminal (~)"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors duration-200 border border-border/30"
              title={soundEnabled ? "Mute UI sounds" : "Enable UI sounds"}
              aria-label="Toggle sound effects"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-primary" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => {
                  soundManager.playToggle();
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors duration-200 border border-border/30"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => {
                soundManager.playClick();
                setIsMobileOpen(!isMobileOpen);
              }}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer hover:bg-muted transition-colors duration-200 border border-border/30"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-background border-l border-border p-6 lg:hidden overflow-y-auto"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 cursor-pointer",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
