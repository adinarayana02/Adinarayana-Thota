"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Code2 } from "lucide-react";
import confetti from "canvas-confetti";
import { soundManager } from "@/lib/sounds";

interface CommandLog {
  id: string;
  type: "input" | "output" | "error" | "success";
  text: string | React.ReactNode;
}

const WELCOME_BANNER = `
  █████╗ ██████╗ ██╗███╗   ██╗ █████╗ ██████╗  █████╗ ██╗   ██╗ █████╗ ███╗   ██╗ █████╗ 
 ██╔══██╗██╔══██╗██║████╗  ██║██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║██╔══██╗
 ███████║██║  ██║██║██╔██╗ ██║███████║██████╔╝███████║ ╚████╔╝ ███████║██╔██╗ ██║███████║
 ██╔══██║██║  ██║██║██║╚██╗██║██╔══██║██╔══██╗██╔══██║  ╚██╔╝  ██╔══██║██║╚██╗██║██╔══██║
 ██║  ██║██████╔╝██║██║ ╚████║██║  ██║██║  ██║██║  ██║   ██║   ██║  ██║██║ ╚████║██║  ██║
 ╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
  Adinarayana Thota - Developer (AI / ML, Generative AI & AI Agents) (v2.6.0)
  Type "help" to see available commands or "sudo hire-me" to celebrate!
`;

export function TerminalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<CommandLog[]>([
    { id: "init-banner", type: "output", text: WELCOME_BANNER },
  ]);
  const [isMaximized, setIsMaximized] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Toggle listener on tilde key (~ / `)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        if (target === inputRef.current && e.key === "Escape") {
          setIsOpen(false);
        }
        return;
      }

      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) soundManager.playPop();
          return next;
        });
      }
    };

    const handleCustomOpen = () => {
      soundManager.playPop();
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-terminal-modal", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-terminal-modal", handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, logs]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    soundManager.playClick();
    const newLogs: CommandLog[] = [
      ...logs,
      { id: `${Date.now()}-in`, type: "input", text: `adinarayana@dev:~$ ${cmd}` },
    ];

    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const lower = cmd.toLowerCase();

    if (lower === "clear" || lower === "cls") {
      setLogs([]);
      setInputVal("");
      return;
    }

    if (lower === "help") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="space-y-1 py-1">
            <p className="text-primary font-bold">Available Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
              <div><span className="text-foreground font-semibold">whoami / about</span> - Summary & bio</div>
              <div><span className="text-foreground font-semibold">skills</span> - Technical stack & tools</div>
              <div><span className="text-foreground font-semibold">projects</span> - Key featured projects</div>
              <div><span className="text-foreground font-semibold">blog / substack</span> - AI engineering articles</div>
              <div><span className="text-foreground font-semibold">exp / work</span> - Work experience history</div>
              <div><span className="text-foreground font-semibold">resume</span> - Resume credentials link</div>
              <div><span className="text-foreground font-semibold">contact</span> - Email & phone info</div>
              <div><span className="text-foreground font-semibold">socials</span> - GitHub, LinkedIn, Substack</div>
              <div><span className="text-foreground font-semibold">clear</span> - Clear terminal output</div>
              <div className="sm:col-span-2 text-emerald-400 font-semibold"><span className="text-yellow-400 font-bold">sudo hire-me</span> - Hire Adinarayana & trigger celebration</div>
            </div>
          </div>
        ),
      });
    } else if (lower === "whoami" || lower === "about") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="space-y-1">
            <p className="text-foreground font-semibold">Adinarayana Thota - Developer (AI / ML, Generative AI & AI Agents)</p>
            <p className="text-muted-foreground">Specializing in Generative AI, Multi-Agent Systems, RAG architecture, Vector DBs (ChromaDB), and FastAPI high-throughput backends.</p>
            <p className="text-xs text-primary">Andhra Pradesh, India | M.Tech IT @ Andhra University (2024-2026, CGPA: 8.5/10) | B.Tech IT @ VVIT (CGPA: 7.91/10)</p>
          </div>
        ),
      });
    } else if (lower === "skills") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="space-y-1 text-xs">
            <p><span className="text-primary font-bold">Languages:</span> Python, JavaScript, HTML, CSS</p>
            <p><span className="text-primary font-bold">AI / ML / GenAI:</span> LLMs, RAG, LangChain, ChromaDB, AutoGPT, n8n, OpenAI Whisper, DenseNet121, TensorFlow, Scikit-learn</p>
            <p><span className="text-primary font-bold">Full Stack & Systems:</span> FastAPI, React.js, Next.js, Django, REST APIs, MySQL, PostgreSQL, Pandas, NumPy</p>
            <p><span className="text-primary font-bold">DevOps & Core:</span> Git, Docker, AWS, SDLC, DBMS, Operating Systems, OOPS, Design Patterns</p>
          </div>
        ),
      });
    } else if (lower === "projects") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-emerald-400 font-bold">1. Hybrid AI Recruitment Platform:</span> Agentic LangGraph system with Hybrid RAG, Qdrant, Recruiter Copilot, and MLflow.
            </div>
            <div>
              <span className="text-emerald-400 font-bold">2. Autonomous Enterprise Manager:</span> Enterprise-Grade Multi-Agent AI Platform & Knowledge System (LangGraph, Gemini, Qdrant).
            </div>
            <div>
              <span className="text-emerald-400 font-bold">3. Voice Activity Detection Framework:</span> Speech ML Pipeline & AI Resort Assistant (Whisper, ChromaDB, FastAPI).
            </div>
            <div>
              <span className="text-emerald-400 font-bold">4. NeoDetect:</span> Document & Image Fraud Detection System (DenseNet121, Llama, TensorFlow, FastAPI).
            </div>
            <div>
              <span className="text-emerald-400 font-bold">5. KARAM AI:</span> Generative AI Multi-Agent Automation Platform (AutoGPT, LangChain, ChromaDB, n8n).
            </div>
          </div>
        ),
      });
    } else if (lower === "exp" || lower === "experience" || lower === "work") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-yellow-400 font-bold">★ Developer (AI / ML, Generative AI)</span> @ <span className="text-foreground font-semibold">TELIC INFO SERVICES PRIVATE LIMITED</span> (Jul 2024 - Nov 2024)
              <p className="text-muted-foreground">• Engineered a B2B AI Business Automation Platform with Voice Calling Agents, Social Media &amp; SEO Automation, and Lead Management.</p>
              <p className="text-muted-foreground">• Built real-time customer voice agent, automated call summaries for sales follow-ups, and lead qualification pipelines.</p>
              <p className="text-muted-foreground">• Developed with Python, FastAPI, LLM APIs, RAG, ChromaDB vector search, prompt orchestration, and MLflow.</p>
            </div>
          </div>
        ),
      });
    } else if (lower === "resume") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="text-xs space-y-1">
            <p className="text-foreground font-semibold">Portfolio & Resume Link:</p>
            <a
              href="https://drive.google.com/file/d/1AYY0kQj35_CZtZc0gpwWbWnrzkSXWRxw/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              https://drive.google.com/file/d/1AYY0kQj35_CZtZc0gpwWbWnrzkSXWRxw/view?usp=sharing
            </a>
          </div>
        ),
      });
    } else if (lower === "contact") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="text-xs space-y-1">
            <p><span className="text-foreground">Email:</span> thotaadinarayana02@gmail.com</p>
            <p><span className="text-foreground">Phone:</span> +91 8309871401</p>
            <p><span className="text-foreground">Website:</span> https://adinarayanathota.vercel.app/</p>
          </div>
        ),
      });
    } else if (lower === "socials" || lower === "channels") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="text-xs space-y-1">
            <p>Instagram: instagram.com/techtalks02 (@techtalks02 - AI Agent Videos)</p>
            <p>YouTube: youtube.com/@Techtalks02-ai (@Techtalks02-ai - TechTalks02 AI)</p>
            <p>GitHub: github.com/adinarayana02</p>
            <p>LinkedIn: linkedin.com/in/thota-adinarayana/</p>
            <p>Substack: thotaadinarayana.substack.com (@techtalks02)</p>
            <p>Portfolio: adinarayanathota.vercel.app</p>
          </div>
        ),
      });
    } else if (lower === "blog" || lower === "substack" || lower === "articles") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="space-y-1.5 text-xs">
            <p className="text-primary font-bold">Thota’s Substack (@techtalks02) - Recent Articles:</p>
            <p className="text-foreground">• 1. AI Benchmarks: Why a Higher Score Doesn’t Always Mean a Better AI Model</p>
            <p className="text-foreground">• 2. Fine-Tuning an AI Voice Agent: From Audio Dataset to Production</p>
            <p className="text-foreground">• 3. Hermes Agent: From AI Chatbot to a Customizable AI Agent</p>
            <p className="text-foreground">• 4. Advanced RAG: How to Build Better Retrieval Pipelines</p>
            <p className="text-foreground">• 5. Agentic RAG Explained: Architecture & Real-World Food Ordering Agent</p>
            <div className="pt-1">
              <a
                href="https://thotaadinarayana.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff6719] underline font-semibold"
              >
                Open Substack: https://thotaadinarayana.substack.com
              </a>
            </div>
          </div>
        ),
      });
    } else if (lower === "sudo hire-me" || lower === "hire-me" || lower === "hire") {
      soundManager.playSuccess();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"],
      });

      newLogs.push({
        id: `${Date.now()}-out`,
        type: "success",
        text: (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl space-y-2 my-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Code2 size={16} />
              <span>Permission Granted: OFFER_SUBMITTED_SUCCESSFULLY!</span>
            </div>
            <p className="text-xs text-foreground">
              Thank you for considering me! Let&apos;s discuss opportunities, scope, and technical roadmap:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="mailto:thotaadinarayana02@gmail.com?subject=Job%20Opportunity%20for%20Adinarayana%20Thota"
                className="bg-primary text-primary-foreground font-bold px-3 py-1 rounded text-[11px] hover:opacity-90 transition"
              >
                Send Email Now
              </a>
              <a
                href="https://www.linkedin.com/in/thota-adinarayana/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted text-foreground border border-border px-3 py-1 rounded text-[11px] hover:bg-muted/80 transition"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        ),
      });
    } else {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "error",
        text: `zsh: command not found: "${cmd}". Type "help" for a list of commands.`,
      });
    }

    setLogs(newLogs);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(history[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className={`w-full bg-[#0a0f1d] border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono ${
              isMaximized ? "h-[90vh] max-w-6xl" : "h-[560px] max-w-3xl"
            }`}
          >
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0d121f] border-b border-border/40 select-none">
              <div className="flex items-center gap-2">
                <div
                  onClick={() => setIsOpen(false)}
                  className="w-3 h-3 rounded-full bg-red-500/90 hover:opacity-80 cursor-pointer transition"
                  title="Close Terminal"
                />
                <div
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="w-3 h-3 rounded-full bg-yellow-500/90 hover:opacity-80 cursor-pointer transition"
                  title="Toggle Window Size"
                />
                <div
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="w-3 h-3 rounded-full bg-green-500/90 hover:opacity-80 cursor-pointer transition"
                  title="Toggle Maximize"
                />
                <span className="ml-3 text-xs text-muted-foreground/80 flex items-center gap-1.5">
                  <TerminalIcon size={13} className="text-primary" />
                  <span>adinarayana@dev-box: ~ (zsh)</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1 hover:text-foreground transition cursor-pointer"
                >
                  {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:text-foreground transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar text-xs leading-relaxed space-y-2 text-slate-200">
              {logs.map((log) => {
                if (log.type === "input") {
                  return (
                    <div key={log.id} className="text-primary font-bold">
                      {log.text}
                    </div>
                  );
                }
                if (log.type === "error") {
                  return (
                    <div key={log.id} className="text-rose-400">
                      {log.text}
                    </div>
                  );
                }
                if (typeof log.text === "string" && log.id === "init-banner") {
                  return (
                    <pre key={log.id} className="text-[9px] sm:text-[10.5px] leading-none text-emerald-400 overflow-x-auto whitespace-pre font-mono select-none">
                      {log.text}
                    </pre>
                  );
                }
                return (
                  <div key={log.id} className="text-slate-300">
                    {log.text}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Terminal Input Prompt */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#0d121f] border-t border-border/40">
              <span className="text-emerald-400 font-bold shrink-0">adinarayana@dev:~$</span>
              <input
                ref={inputRef}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type a command (try: help, skills, projects, sudo hire-me)..."
                className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono text-xs"
              />
              <span className="w-2 h-4 bg-primary animate-pulse shrink-0" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
