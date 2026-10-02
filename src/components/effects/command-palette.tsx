"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import confetti from "canvas-confetti";
import {
  Search,
  Command,
  ArrowRight,
  FolderGit2,
  Briefcase,
  User,
  GraduationCap,
  Mail,
  Download,
  Copy,
  Terminal,
  Sun,
  Moon,
  ExternalLink,
  Code2,
  Check,
  BookOpen,
  Award
} from "lucide-react";
import { soundManager } from "@/lib/sounds";

interface CommandItem {
  id: string;
  category: "Navigation" | "Projects" | "Actions" | "Socials" | "Substack Articles" | "LinkedIn Articles";
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const togglePalette = useCallback(() => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen) {
      setQuery("");
      setSelectedIndex(0);
      soundManager.playPop();
    } else {
      soundManager.playClick();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, togglePalette]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const triggerConfetti = () => {
    soundManager.playSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("thotaadinarayana02@gmail.com");
    soundManager.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openTerminal = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("open-terminal-modal"));
  };

  const items: CommandItem[] = [
    // Navigation
    {
      id: "nav-home",
      category: "Navigation",
      title: "Home",
      subtitle: "Overview, hero, experience timeline, and demos",
      icon: User,
      action: () => { router.push("/"); setIsOpen(false); },
      shortcut: "H"
    },
    {
      id: "nav-projects",
      category: "Navigation",
      title: "All Projects",
      subtitle: "Browse all featured AI, Multi-Agent, and Vision projects",
      icon: FolderGit2,
      action: () => { router.push("/projects"); setIsOpen(false); },
      shortcut: "P"
    },
    {
      id: "nav-exp",
      category: "Navigation",
      title: "Work Experience",
      subtitle: "TELIC INFO SERVICES PRIVATE LIMITED (AI / ML & Generative AI)",
      icon: Briefcase,
      action: () => { router.push("/experience"); setIsOpen(false); },
      shortcut: "E"
    },
    {
      id: "nav-about",
      category: "Navigation",
      title: "About Adinarayana",
      subtitle: "Bio, education, story, and engineering vision",
      icon: GraduationCap,
      action: () => { router.push("/about"); setIsOpen(false); },
      shortcut: "A"
    },
    {
      id: "nav-contact",
      category: "Navigation",
      title: "Contact Page",
      subtitle: "Send a message or collaboration request",
      icon: Mail,
      action: () => { router.push("/contact"); setIsOpen(false); },
      shortcut: "C"
    },
    {
      id: "nav-certs",
      category: "Navigation",
      title: "Certifications & AI Credentials",
      subtitle: "AI Agent Architect, LLM Masters, AWS & Hackathon Credentials (2026)",
      icon: Award,
      action: () => { router.push("/certificates"); setIsOpen(false); },
    },
    {
      id: "nav-resume",
      category: "Navigation",
      title: "Resume View",
      subtitle: "Interactive resume and credentials breakdown",
      icon: Download,
      action: () => { router.push("/resume"); setIsOpen(false); },
      shortcut: "R"
    },

    // Actions
    {
      id: "action-terminal",
      category: "Actions",
      title: "Launch Interactive CLI Terminal",
      subtitle: "Run shell commands in developer terminal mode (~)",
      icon: Terminal,
      action: openTerminal,
      shortcut: "~"
    },
    {
      id: "action-confetti",
      category: "Actions",
      title: "Run Celebration Effect",
      subtitle: "Trigger a small interactive confetti burst",
      icon: Code2,
      action: () => { triggerConfetti(); setIsOpen(false); }
    },
    {
      id: "action-copy-email",
      category: "Actions",
      title: copied ? "Copied to clipboard!" : "Copy Adinarayana's Email",
      subtitle: "thotaadinarayana02@gmail.com",
      icon: copied ? Check : Copy,
      action: copyEmail
    },
    {
      id: "action-download-resume",
      category: "Actions",
      title: "Download Official Resume / Portfolio",
      subtitle: "Direct credentials link",
      icon: Download,
      action: () => {
        soundManager.playSuccess();
        window.open("https://drive.google.com/file/d/1FTtZLLZYsGK8boAFuCLHdMmciIIOjFLz/view?usp=sharing", "_blank");
        setIsOpen(false);
      }
    },
    {
      id: "action-toggle-theme",
      category: "Actions",
      title: theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme",
      subtitle: `Current theme: ${theme || "dark"}`,
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        soundManager.playToggle();
        setTheme(theme === "dark" ? "light" : "dark");
        setIsOpen(false);
      }
    },

    // Projects Direct Links
    {
      id: "proj-neodetect",
      category: "Projects",
      title: "NeoDetect - Fraud Detection System",
      subtitle: "DenseNet121, Llama, TensorFlow, FastAPI, RAG",
      icon: Code2,
      action: () => { router.push("/projects/neodetect"); setIsOpen(false); }
    },
    {
      id: "proj-karam-ai",
      category: "Projects",
      title: "KARAM AI - Multi-Agent Platform",
      subtitle: "AutoGPT, LangChain, ChromaDB, n8n, FastAPI",
      icon: Code2,
      action: () => { router.push("/projects/karam-ai"); setIsOpen(false); }
    },
    {
      id: "proj-chatbot",
      category: "Projects",
      title: "Multi-Functional AI Chatbot Platform",
      subtitle: "FastAPI, RAG, OpenAI, React, Pandas, Q&A & PDF search",
      icon: Code2,
      action: () => { router.push("/projects/ai-chatbot-platform"); setIsOpen(false); }
    },
    {
      id: "proj-virtual-tryon",
      category: "Projects",
      title: "AI Virtual Try-On (Hackathon Winner)",
      subtitle: "Computer vision and deep learning apparel fitting",
      icon: Code2,
      action: () => { router.push("/projects/virtual-tryon"); setIsOpen(false); }
    },

    // Substack & Articles
    {
      id: "art-benchmarks",
      category: "Substack Articles",
      title: "AI Benchmarks: Why a Higher Score Doesn't Always Mean a Better AI Model",
      subtitle: "Benchmark contamination, saturation, Goodhart's law & dynamic testing",
      icon: BookOpen,
      action: () => { router.push("/blog/ai-benchmarks-why-a-higher-score"); setIsOpen(false); }
    },
    {
      id: "art-voice",
      category: "Substack Articles",
      title: "Fine-Tuning an AI Voice Agent: From Audio Dataset to Production",
      subtitle: "Dataset curation, STT/LLM/TTS fine-tuning, and voice architecture",
      icon: BookOpen,
      action: () => { router.push("/blog/fine-tuning-an-ai-voice-agent-from"); setIsOpen(false); }
    },
    {
      id: "art-hermes",
      category: "Substack Articles",
      title: "Hermes Agent: From AI Chatbot to a Customizable AI Agent",
      subtitle: "Persistent memory, MCP servers, skills, and autonomous workflows",
      icon: BookOpen,
      action: () => { router.push("/blog/hermes-agent-from-ai-chatbot-to-a"); setIsOpen(false); }
    },
    {
      id: "art-rag",
      category: "Substack Articles",
      title: "Advanced RAG: How to Build Better Retrieval Pipelines",
      subtitle: "Query transformation, hybrid search, reranking & context filtering",
      icon: BookOpen,
      action: () => { router.push("/blog/advanced-rag-how-to-build-better"); setIsOpen(false); }
    },
    {
      id: "art-agentic-rag",
      category: "Substack Articles",
      title: "Agentic RAG Explained: Architecture & Real-World Implementation",
      subtitle: "Autonomous reasoning loops, multi-source retrieval & self-correction",
      icon: BookOpen,
      action: () => { router.push("/blog/agentic-rag-explained-architecture"); setIsOpen(false); }
    },

    // LinkedIn Posts & Guides
    {
      id: "li-telegram-ai",
      category: "LinkedIn Articles",
      title: "Personal AI Assistant Built with n8n & Telegram",
      subtitle: "OpenAI Whisper voice notes, Pinecone vector search & ElevenLabs audio",
      icon: BookOpen,
      action: () => { window.open("https://lnkd.in/p/dDZugJWA", "_blank"); setIsOpen(false); }
    },
    {
      id: "li-marketing-ai",
      category: "LinkedIn Articles",
      title: "AI Marketing Asset Generator with n8n & GPT-4",
      subtitle: "Automated visual synthesis, ad copywriting & multi-channel workflows",
      icon: BookOpen,
      action: () => { window.open("https://lnkd.in/p/dFnpHqFp", "_blank"); setIsOpen(false); }
    },
    {
      id: "li-lld-notes",
      category: "LinkedIn Articles",
      title: "System Design Series: Understanding Low Level Design (LLD)",
      subtitle: "Object-oriented principles, SOLID architecture & design patterns",
      icon: BookOpen,
      action: () => { window.open("https://lnkd.in/p/dVgPau2S", "_blank"); setIsOpen(false); }
    },
    {
      id: "li-hld-lld",
      category: "LinkedIn Articles",
      title: "Mastering System Design: From HLD to LLD for Backend Engineers",
      subtitle: "Scalability, caching (Redis), sharding, Kafka & microservices patterns",
      icon: BookOpen,
      action: () => { window.open("https://lnkd.in/p/dTJygtkC", "_blank"); setIsOpen(false); }
    },

    // Socials
    {
      id: "soc-instagram",
      category: "Socials",
      title: "Tech Talks 02 (@techtalks02) - Instagram",
      subtitle: "AI Agents & GenAI Video Content (instagram.com/techtalks02)",
      icon: ExternalLink,
      action: () => {
        window.open("https://www.instagram.com/techtalks02/", "_blank");
        setIsOpen(false);
      }
    },
    {
      id: "soc-youtube",
      category: "Socials",
      title: "TechTalks02 AI (@Techtalks02-ai) - YouTube",
      subtitle: "AI Systems Demos & Tutorials (youtube.com/@Techtalks02-ai)",
      icon: ExternalLink,
      action: () => {
        window.open("https://www.youtube.com/@Techtalks02-ai", "_blank");
        setIsOpen(false);
      }
    },
    {
      id: "soc-substack",
      category: "Socials",
      title: "Thota's Substack (@techtalks02)",
      subtitle: "thotaadinarayana.substack.com",
      icon: ExternalLink,
      action: () => {
        window.open("https://thotaadinarayana.substack.com", "_blank");
        setIsOpen(false);
      }
    },
    {
      id: "soc-linkedin",
      category: "Socials",
      title: "LinkedIn Profile",
      subtitle: "linkedin.com/in/thota-adinarayana/",
      icon: ExternalLink,
      action: () => {
        window.open("https://www.linkedin.com/in/thota-adinarayana/", "_blank");
        setIsOpen(false);
      }
    },
    {
      id: "soc-github",
      category: "Socials",
      title: "GitHub Repository",
      subtitle: "github.com/adinarayana02",
      icon: ExternalLink,
      action: () => {
        window.open("https://github.com/adinarayana02", "_blank");
        setIsOpen(false);
      }
    },
    {
      id: "soc-leetcode",
      category: "Socials",
      title: "LeetCode Profile",
      subtitle: "leetcode.com",
      icon: ExternalLink,
      action: () => {
        window.open("https://leetcode.com", "_blank");
        setIsOpen(false);
      }
    }
  ];

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      soundManager.playPop();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      soundManager.playPop();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      soundManager.playClick();
      filteredItems[selectedIndex]?.action();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
            >
              {/* Search Bar Input */}
              <div className="flex items-center px-4 border-b border-border/60 gap-3 py-3.5 bg-muted/20">
                <Search size={18} className="text-primary shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search (projects, resume, contact)..."
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted/60 border border-border/60 rounded">
                  ESC
                </kbd>
              </div>

              {/* Items List */}
              <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar max-h-[380px]">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  filteredItems.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          soundManager.playClick();
                          item.action();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 text-primary border border-primary/25"
                            : "text-foreground hover:bg-muted/40 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-lg ${
                              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold truncate flex items-center gap-2">
                              <span>{item.title}</span>
                              <span className="text-[10px] font-mono text-muted-foreground/70 bg-muted/40 px-1.5 py-0.2 rounded border border-border/40">
                                {item.category}
                              </span>
                            </div>
                            {item.subtitle && (
                              <p className="text-[11px] text-muted-foreground truncate">{item.subtitle}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {item.shortcut && (
                            <kbd className="text-[10px] font-mono bg-muted/40 text-muted-foreground px-1.5 py-0.5 rounded border border-border/40">
                              {item.shortcut}
                            </kbd>
                          )}
                          <ArrowRight
                            size={14}
                            className={`transition-transform duration-200 ${
                              isSelected ? "translate-x-0.5 text-primary opacity-100" : "opacity-0"
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Bottom Footer Keys Help */}
              <div className="border-t border-border/40 px-4 py-2.5 bg-muted/15 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border/60">↑</kbd>
                    <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border/60">↓</kbd> to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border/60">↵</kbd> to select
                  </span>
                </div>
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <Command size={12} /> Adinarayana OS Spotlight
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
