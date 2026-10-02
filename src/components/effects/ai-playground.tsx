"use client";

import { useState, useRef } from "react";
import { Sliders, Play, Terminal as TermIcon, RotateCcw, HelpCircle, AlertCircle } from "lucide-react";

interface UsageStats {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export function AiPlayground() {
  const DEFAULT_SYSTEM_PROMPT = 
    "You are Adinarayana's AI Twin. Speak in a concise, technical, yet friendly tone. State that Adinarayana is pursuing M.Tech in Information Technology at Andhra University (CGPA: 8.5/10), and highlight his specialization in Multi-Agent Systems, RAG pipelines, FastAPI, and Deep Learning (DenseNet121, Llama).";

  const PRESETS = [
    {
      name: "Goku Mode",
      system: "You are Goku's spirit acting as Adinarayana's AI twin. Answer technical questions about Adinarayana but in the enthusiastic, martial arts style of Goku! Use words like 'KA-ME-HA-ME-HA!', 'Power level!', and 'Training!'. Keep it fun and hyped.",
      user: "Explain Adinarayana's expertise in Multi-Agent Systems and FastAPI."
    },
    {
      name: "HR Recruiter Pitch",
      system: "You are an executive talent acquisition partner pitching Adinarayana for an AI/ML & Generative AI Engineer role. Highlight key business value, his achievements at Telic Info Services (B2B AI Business Automation Platform, Voice Calling & Lead Management), NeoDetect fraud capture gains (+30%), AI Agent tutorials (@techtalks02), and Hackathon victory.",
      user: "Why should we hire Adinarayana for our AI engineering team?"
    },
    {
      name: "Hacker Terminal",
      system: "You are a cybernetic terminal assistant. Format your replies with terminal symbols like [OK], [METRIC], and lines of debug output. Speak like a machine.",
      user: "List Adinarayana's tech stack and engineering credentials."
    }
  ];

  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(250);
  const [userPrompt, setUserPrompt] = useState("What AI, Generative AI, and Agentic techniques does Adinarayana specialize in?");
  const [isLoading, setIsLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Typewriter effect state
  const [displayedResponse, setDisplayedResponse] = useState("");
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTypewriter = (text: string) => {
    if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
    setDisplayedResponse("");
    let index = 0;
    
    // Smooth typewriter output speed
    const charsPerTick = text.length > 300 ? 3 : 1; 
    
    typewriterIntervalRef.current = setInterval(() => {
      index += charsPerTick;
      if (index >= text.length) {
        setDisplayedResponse(text);
        if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
      } else {
        setDisplayedResponse(text.slice(0, index));
      }
    }, 15);
  };

  const handleExecute = async () => {
    if (!userPrompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setDisplayedResponse("");
    setLatency(null);
    setUsage(null);

    const startTime = performance.now();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userPrompt.trim() }],
          systemPrompt: systemPrompt.trim(),
          temperature: temperature,
          maxTokens: maxTokens
        })
      });

      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));

      if (res.ok) {
        const data = await res.json();
        startTypewriter(data.message);
        if (data.usage) {
          setUsage(data.usage);
        }
      } else {
        const data = await res.json();
        setError(data.error || "Execution failed. Please check parameters.");
      }
    } catch (err) {
      console.error("Playground error:", err);
      setError("Network error. Unable to query Groq model.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    setTemperature(0.7);
    setMaxTokens(250);
    setUserPrompt("What AI, Generative AI, and Agentic techniques does Adinarayana specialize in?");
    setDisplayedResponse("");
    setLatency(null);
    setUsage(null);
    setError(null);
    if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setSystemPrompt(preset.system);
    setUserPrompt(preset.user);
  };

  return (
    <div className="ai-playground-shell w-full grid grid-cols-1 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] gap-5 xl:gap-7 bg-black/40 border border-border/40 rounded-3xl p-5 sm:p-6 xl:p-7 backdrop-blur-xl relative overflow-hidden">
      
      {/* Decorative background grid and glow */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-grid-pattern bg-[size:15px_15px]" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* ── Left Side: Controls & Sliders (5 cols) ── */}
      <div className="flex flex-col gap-5 relative z-10 border-b lg:border-b-0 lg:border-r border-border/40 pb-5 lg:pb-0 lg:pr-7">
        <div className="flex items-center gap-2 border-b border-border/20 pb-3">
          <Sliders size={16} className="text-primary" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Inference Hyperparameters</h3>
        </div>

        {/* System Prompt Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            System Instructions
            <span className="group relative cursor-pointer text-muted-foreground/60 hover:text-foreground">
              <HelpCircle size={12} />
              <span className="absolute bottom-5 left-0 w-48 p-2 rounded bg-card border border-border text-[10px] font-normal leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-50">
                Dictates the twin&apos;s persona, knowledge base, and tone of voice.
              </span>
            </span>
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full h-24 bg-muted/30 focus:bg-muted/60 border border-border/60 focus:border-primary/50 text-foreground text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none transition-all duration-200"
            placeholder="System rules..."
          />
        </div>

        {/* Temperature Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Temperature ({temperature})</span>
            <span className="text-[10px] text-primary">{temperature <= 0.3 ? "Deterministic" : temperature >= 1.2 ? "Highly Creative" : "Balanced"}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-primary bg-muted/40 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Max Tokens Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Max Completion Tokens ({maxTokens})</span>
          </div>
          <input
            type="range"
            min="50"
            max="1024"
            step="50"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="w-full accent-primary bg-muted/40 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Presets */}
        <div className="space-y-2 mt-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Twin Stance Presets</span>
          <div className="flex flex-wrap gap-2 pt-1">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="text-[10px] font-semibold bg-muted/40 hover:bg-primary/10 border border-border/50 hover:border-primary/30 text-foreground px-3 py-1.5 rounded-lg transition-colors cursor-pointer select-none"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Side: Input & Terminal Output (7 cols) ── */}
      <div className="flex flex-col gap-5 relative z-10">
        
        {/* User Prompt Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            User Query
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="flex-1 h-14 bg-muted/30 focus:bg-muted/60 border border-border/60 focus:border-primary/50 text-foreground text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none transition-all duration-200"
              placeholder="Query Adinarayana's twin..."
            />
            <button
              onClick={handleExecute}
              disabled={isLoading || !userPrompt.trim()}
              className="h-14 px-5 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-xs uppercase tracking-wider transition-opacity shadow-lg shadow-primary/15 shrink-0 select-none"
            >
              <Play size={12} fill="currentColor" />
              <span>Run Inference</span>
            </button>
          </div>
        </div>

        {/* Terminal Staged Output */}
        <div className="flex-1 flex flex-col border border-border/40 rounded-2xl bg-black/60 overflow-hidden min-h-[260px]">
          
          {/* Terminal Title Bar */}
          <div className="px-4 py-2 border-b border-border/20 bg-muted/20 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <TermIcon size={12} className="text-primary" />
              <span>TERMINAL // INFERENCE_CONSOLE</span>
            </div>
            <button
              onClick={handleReset}
              className="hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer select-none"
              title="Reset Sandbox"
            >
              <RotateCcw size={10} />
              <span>Reset</span>
            </button>
          </div>

          {/* Console Output Area */}
          <div className="flex-1 p-4 font-mono text-xs leading-relaxed text-foreground select-text overflow-y-auto max-h-[260px] custom-scrollbar">
            
            {/* Loading state indicator */}
            {isLoading && !displayedResponse && (
              <div className="flex items-center gap-2 text-primary animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Executing forward pass (Groq Qwen 3.8 LPU)...</span>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="flex items-start gap-2 text-red-400">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Output display */}
            {!isLoading && !displayedResponse && !error && (
              <span className="text-muted-foreground/60 italic">Console idle. Configure hyperparams, write a query, and hit &quot;Run Inference&quot; to execute.</span>
            )}

            {displayedResponse && (
              <span className="whitespace-pre-wrap">{displayedResponse}</span>
            )}

            {/* Simulated cursor blinking */}
            {isLoading && (
              <span className="w-1.5 h-3.5 bg-primary ml-1 inline-block animate-pulse align-middle" />
            )}
          </div>

          {/* Terminal Bottom stats strip */}
          <div className="px-4 py-2 border-t border-border/20 bg-muted/10 grid grid-cols-3 gap-2 text-[10px] font-mono text-muted-foreground text-center">
            <div className="border-r border-border/20 py-1">
              <span>LATENCY: </span>
              <span className="text-foreground font-bold">{latency !== null ? `${latency}ms` : "--"}</span>
            </div>
            <div className="border-r border-border/20 py-1">
              <span>TOKENS: </span>
              <span className="text-foreground font-bold">
                {usage ? `${usage.prompt_tokens} In / ${usage.completion_tokens} Out` : "--"}
              </span>
            </div>
            <div className="py-1">
              <span>MODEL: </span>
              <span className="text-primary font-bold">qwen-3.8-27b</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
