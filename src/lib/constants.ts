import type { IProject, ICertificate, IExperience, IBlog } from "@/types";

export const siteConfig = {
  name: "Adinarayana Thota",
  title: "AI / ML Developer & Generative AI Specialist",
  description:
    "AI/ML Developer specializing in Generative AI, Multi-Agent Systems, AI Agents, RAG pipelines, and scalable APIs. Pursuing M.Tech in Information Technology at Andhra University with hands-on experience in Python, FastAPI, React.js, ChromaDB, and modern AI/ML frameworks.",
  url: "https://adinarayanathota.vercel.app",
  email: "thotaadinarayana02@gmail.com",
  phone: "+91 8309871401",
  location: "Andhra Pradesh, India",
  links: {
    github: "https://github.com/adinarayana02",
    linkedin: "https://www.linkedin.com/in/thota-adinarayana/",
    instagram: "https://www.instagram.com/techtalks02/",
    instagramHandle: "@techtalks02",
    youtube: "https://www.youtube.com/@Techtalks02-ai",
    youtubeHandle: "@Techtalks02-ai",
    substack: "https://thotaadinarayana.substack.com",
    substackProfile: "https://substack.com/@techtalks02",
    leetcode: "https://leetcode.com",
    resume: "https://drive.google.com/file/d/1AYY0kQj35_CZtZc0gpwWbWnrzkSXWRxw/view?usp=sharing",
  },
  githubUsername: "adinarayana02",
  leetcodeUsername: "adinarayana02",
};

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Experience", href: "/experience" },
  { name: "Projects", href: "/projects" },
  { name: "GitHub", href: "/github" },
  { name: "LeetCode", href: "/leetcode" },
  { name: "Certificates", href: "/certificates" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export const skillCategories = [
  {
    category: "Programming Languages",
    skills: [
      { name: "Python", icon: "terminal" },
      { name: "JavaScript", icon: "file-type" },
      { name: "HTML", icon: "file-code" },
      { name: "CSS", icon: "palette" },
    ],
  },
  {
    category: "Frameworks & Web",
    skills: [
      { name: "React.js", icon: "atom" },
      { name: "FastAPI", icon: "zap" },
      { name: "Django", icon: "server" },
      { name: "REST APIs", icon: "network" },
      { name: "HTML5 & CSS3", icon: "layout" },
    ],
  },
  {
    category: "AI/ML & Deep Learning",
    skills: [
      { name: "TensorFlow", icon: "brain" },
      { name: "DenseNet121", icon: "cpu" },
      { name: "Scikit-learn", icon: "settings" },
      { name: "Pandas", icon: "bar-chart-3" },
      { name: "NumPy", icon: "calculator" },
      { name: "Matplotlib", icon: "pie-chart" },
      { name: "OpenAI Whisper", icon: "mic" },
      { name: "Llama", icon: "bot" },
      { name: "AutoGPT", icon: "workflow" },
    ],
  },
  {
    category: "Generative AI & Agentic Systems",
    skills: [
      { name: "Large Language Models (LLMs)", icon: "bot" },
      { name: "Retrieval Augmented Generation (RAG)", icon: "search" },
      { name: "LangChain", icon: "link" },
      { name: "Vector DBs (ChromaDB)", icon: "database" },
      { name: "n8n Workflow Automation", icon: "workflow" },
      { name: "Prompt Engineering", icon: "terminal" },
      { name: "Multi-Agent Systems", icon: "cpu" },
    ],
  },
  {
    category: "Database & Cloud",
    skills: [
      { name: "MySQL", icon: "database" },
      { name: "PostgreSQL", icon: "table" },
      { name: "ChromaDB", icon: "search" },
      { name: "AWS", icon: "cloud" },
      { name: "Docker", icon: "box" },
      { name: "ETL Pipelines", icon: "git-merge" },
    ],
  },
  {
    category: "Engineering Principles & Tools",
    skills: [
      { name: "SDLC", icon: "workflow" },
      { name: "DBMS", icon: "database" },
      { name: "Operating Systems", icon: "monitor" },
      { name: "ETL", icon: "filter" },
      { name: "OOPS & Design Patterns", icon: "git-branch" },
      { name: "Git", icon: "git-merge" },
      { name: "Model Safety & Evaluation", icon: "shield-check" },
      { name: "NLP Explainability", icon: "message-square" },
    ],
  },
];

export const experiences: IExperience[] = [
  {
    company: "TELIC INFO SERVICES PRIVATE LIMITED",
    role: "Developer (AI / ML, Generative AI)",
    type: "Internship",
    location: "India",
    startDate: "Jan 2026",
    endDate: "May 2026",
    current: false,
    bullets: [
      "Engineered a B2B AI-powered business automation platform orchestrating multiple specialized AI workflows across sales, lead management, marketing, and SEO.",
      "Developed an AI Voice Calling Agent that interacts with customers over calls, handles real-time queries, extracts key info, and generates structured conversation summaries for sales team follow-ups.",
      "Built a Social Media Automation Agent to generate localized promotional posts and short-form video content targeting region-specific customer segments.",
      "Designed an automated Lead Management pipeline that leverages customer interaction data to identify, qualify, and manage high-intent sales leads.",
      "Created an SEO Automation workflow for business websites and built end-to-end AI pipelines using Python, FastAPI, LLM APIs, RAG, ChromaDB vector search, and prompt orchestration while optimizing inference and tracking experiments via MLflow.",
    ],
    technologies: ["Python", "FastAPI", "LLM APIs", "RAG", "Vector Search", "ChromaDB", "Prompt Orchestration", "MLflow", "Voice AI", "SEO Automation"],
  },
  {
    company: "Afrov Pvt Limited",
    role: "Data Science Intern",
    type: "Internship",
    location: "India",
    startDate: "Jul 2025",
    endDate: "Nov 2025",
    current: false,
    bullets: [
      "Architected NeoDetect, a document and image fraud detection system to identify potentially fraudulent or manipulated documents.",
      "Built visual analysis pipeline using DenseNet121 with TensorFlow to extract image features and identify forgery patterns in document images.",
      "Integrated Llama with a Retrieval-Augmented Generation (RAG) pipeline to retrieve knowledge context and perform deep semantic document comprehension.",
      "Exposed core AI capabilities via high-performance FastAPI REST APIs for seamless document ingestion and real-time fraud scoring.",
      "Optimized inference workflows using batch inference and asynchronous I/O, substantially reducing overall API response times.",
    ],
    technologies: ["Python", "TensorFlow", "DenseNet121", "Llama", "RAG", "FastAPI", "Computer Vision", "Async I/O", "Fraud Detection"],
  },
];

export const projects: IProject[] = [
  {
    title: "Hybrid AI Recruitment Platform",
    slug: "hybrid-ai-recruitment-platform",
    description: "Agentic AI recruitment platform with LangGraph, Hybrid RAG, Recruiter Copilot, and MLflow tracing.",
    longDescription: "Built an agentic AI recruitment platform that automates job analysis, candidate search, ranking, evaluation, and recruiter assistance across large candidate datasets. Developed a hybrid RAG retrieval pipeline combining dense BGE embeddings, keyword search, Qdrant vector database, and reranking to pinpoint top candidates by skill alignment and experience. Implemented LangGraph-based recruitment agents for job requirement extraction, candidate evaluation, ranking, and evidence-backed recommendations. Features a Recruiter AI Copilot with conversational search, candidate comparison, tool-calling, and MCP integrations, backed by MLflow tracing for latency, token usage, retrieval quality, and production monitoring.",
    techStack: ["Python", "FastAPI", "LangGraph", "Google Gemini", "Qdrant", "BGE Embeddings", "PostgreSQL", "SQLAlchemy", "MLflow"],
    features: [
      "Agentic AI recruitment automating job analysis, candidate search, ranking, and evaluation",
      "Hybrid RAG pipeline using BGE dense embeddings, keyword search, Qdrant vector search, and reranking",
      "LangGraph-based multi-agent workflows for extraction, candidate evaluation, and explainable recommendations",
      "Recruiter AI Copilot with conversational search, candidate comparison, and tool-calling with MCP integrations",
      "MLflow-based tracing and evaluation for retrieval quality, ranking performance, latency, and token monitoring",
    ],
    image: "/projects/hybrid-ai-recruitment-platform.jpg",
    githubUrl: "https://github.com/adinarayana02",
    liveUrl: "https://adinarayanathota.vercel.app/",
    category: "AI",
    featured: true,
    metrics: {
      latency: "110ms (Hybrid Retrieval)",
      costReduction: "75% Screening Time Saved",
      accuracy: "96.4% Ranking Precision",
      throughput: "1,200 candidates/min",
      guardrails: "Evidence-Backed Evaluation & Bias Checks",
      tokensProcessed: "12M/mo",
    },
    challenges: "Achieving high retrieval precision across non-standard resumes and job descriptions without relying exclusively on keyword matching or dense vectors alone.",
    solutions: "Engineered a hybrid RAG pipeline coupling dense BGE embeddings with sparse keyword search in Qdrant and cross-encoder reranking, orchestrated by LangGraph multi-agent state machines.",
    architectureSteps: [
      { title: "Resume & Job Ingestion", description: "Parses multi-format resumes and job specifications into structured PostgreSQL/SQLAlchemy schemas." },
      { title: "Hybrid BGE Vector Indexing", description: "Generates dense BGE embeddings and sparse keyword indices in Qdrant with reciprocal rank fusion (RRF)." },
      { title: "LangGraph Agentic Evaluation", description: "Autonomous agents extract requirements, score candidate competencies, and produce evidence-backed comparative rankings." },
      { title: "Recruiter Copilot & MLflow Tracing", description: "Interactive conversational copilot with MCP tool calling, live evaluation, and MLflow latency/token tracing." },
    ],
  },
  {
    title: "Autonomous Enterprise Manager",
    slug: "autonomous-enterprise-manager",
    description: "Enterprise-Grade Multi-Agent AI Platform & Knowledge System with LangGraph, RAG, Cognitive Memory, and CI/CD.",
    longDescription: "Architected and deployed a production-ready enterprise AI platform featuring multi-agent orchestration, Retrieval-Augmented Generation (RAG), cognitive memory, workflow automation, governance, enterprise integrations, and cloud-native deployment using a modular layered architecture. Developed a RAG-based enterprise knowledge system for document ingestion and GitHub repository indexing using embeddings, Qdrant vector search, semantic retrieval, and grounded question answering. Implemented entity extraction, entity linking, importance scoring, and memory deduplication to maximize the quality and efficiency of agent context.",
    techStack: ["Python", "FastAPI", "LangGraph", "Google Gemini", "PostgreSQL", "Qdrant", "SQLAlchemy", "GitHub Actions"],
    features: [
      "Multi-agent orchestration, cognitive memory, workflow automation, and enterprise governance",
      "RAG-based enterprise knowledge system for document ingestion and GitHub repository indexing",
      "Qdrant vector search, semantic retrieval, and grounded question answering with Google Gemini",
      "Entity extraction, entity linking, importance scoring, and memory deduplication for efficient agent context",
      "Cloud-native modular architecture with automated CI/CD deployment pipelines via GitHub Actions",
    ],
    image: "/projects/autonomous-enterprise-manager.jpg",
    githubUrl: "https://github.com/adinarayana02",
    liveUrl: "https://adinarayanathota.vercel.app/",
    category: "AI",
    featured: true,
    metrics: {
      latency: "140ms / Agent Step",
      costReduction: "70% Enterprise Workflow Overhead",
      accuracy: "97.5% Grounded Q&A Precision",
      throughput: "2,500 operations/hr",
      guardrails: "Cognitive Memory Deduplication & Governance Guardrails",
      tokensProcessed: "18M/mo",
    },
    challenges: "Handling massive document repositories and complex GitHub codebases while maintaining low context redundancy and high grounding accuracy across autonomous agents.",
    solutions: "Implemented a layered architecture with Qdrant vector storage, entity linking, memory deduplication, and LangGraph-managed state machines with granular governance policies.",
    architectureSteps: [
      { title: "Enterprise Knowledge Ingestion", description: "Ingests documentation and indexes entire GitHub repositories with semantic chunking." },
      { title: "Cognitive Memory & Entity Linking", description: "Performs entity extraction, importance scoring, and memory deduplication for concise agent context." },
      { title: "LangGraph Multi-Agent Orchestration", description: "Dispatches tasks across specialized agents powered by Google Gemini for grounded reasoning and execution." },
      { title: "Governance & Cloud Deployment", description: "Enforces enterprise policies, auditing, and continuous deployment through Docker and GitHub Actions." },
    ],
  },
  {
    title: "Voice Activity Detection Framework",
    slug: "voice-activity-detection-framework",
    description: "Production Speech ML Pipeline & Voice-Enabled AI Resort Assistant with Whisper, ChromaDB RAG, and LangGraph.",
    longDescription: "Developed a production speech ML pipeline and voice-enabled AI resort assistant that automates customer support for room information, facilities, bookings, policies, pricing, and frequently asked questions. Built a RAG pipeline using ChromaDB to retrieve relevant resort information and generate context-aware responses, reducing reliance on the LLM's general knowledge. Integrated OpenAI Whisper for streaming speech-to-text and designed a low-latency voice interaction pipeline for real-time customer conversations.",
    techStack: ["Python", "FastAPI", "React.js", "LangGraph", "LLM APIs", "Whisper", "ChromaDB", "MongoDB"],
    features: [
      "Voice-enabled AI resort assistant automating customer queries, bookings, pricing, and policy support",
      "RAG retrieval pipeline with ChromaDB for grounded resort information and context-aware responses",
      "OpenAI Whisper integration for streaming speech-to-text with noise-resilient voice activity detection",
      "Real-time voice interaction pipeline with sub-100ms processing for fluid conversations",
      "Full-stack interface with FastAPI async streaming backend and interactive React.js frontend",
    ],
    image: "/projects/voice-activity-detection-framework.jpg",
    githubUrl: "https://github.com/adinarayana02",
    liveUrl: "https://adinarayanathota.vercel.app/",
    category: "AI",
    featured: true,
    metrics: {
      latency: "90ms (VAD + Ingestion)",
      costReduction: "50% Front-Desk Support Load Cut",
      accuracy: "95.4% Transcription & Intent Precision",
      throughput: "400 voice interactions/hr",
      guardrails: "Strict Resort Policy Grounding & Noise Suppression",
      tokensProcessed: "3.8M/mo",
    },
    challenges: "Achieving low-latency voice activity detection and accurate multilingual speech-to-text over noisy client audio streams.",
    solutions: "Combined client-side audio frame capture with server-side OpenAI Whisper streaming, indexed domain knowledge into ChromaDB for instant RAG lookup, and orchestrated state with LangGraph.",
    architectureSteps: [
      { title: "Audio Ingestion & VAD", description: "Captures real-time microphone stream and applies voice activity detection to isolate speech frames." },
      { title: "Whisper Speech-to-Text", description: "Converts spoken audio to text with high transcription accuracy and noise cancellation." },
      { title: "ChromaDB Grounded RAG", description: "Retrieves exact room pricing, availability, and resort policy documents via cosine similarity." },
      { title: "LangGraph Dialogue Synthesis", description: "Orchestrates conversation state, generates natural language responses, and streams speech back to the user." },
    ],
  },
  {
    title: "NeoDetect",
    slug: "neodetect",
    description: "Document & Image Fraud Detection System using DenseNet121, Llama, and TensorFlow with 30% improved fraud capture rates.",
    longDescription: "Engineered NeoDetect, a document and image fraud detection system using DenseNet121, Llama, and TensorFlow, achieving 30% improvement in fraud capture rates. Applied RAG pipelines for document comprehension tasks, increasing document classification precision. Built secure FastAPI-based RESTful APIs for model serving and optimized response time by 60% using batch inference and asynchronous I/O.",
    techStack: ["DenseNet121", "Llama", "TensorFlow", "FastAPI", "Python", "RAG", "ChromaDB", "REST APIs"],
    features: [
      "Fraud capture system combining DenseNet121 visual features and Llama reasoning",
      "RAG pipelines for document comprehension and classification precision",
      "FastAPI RESTful APIs optimized for 60% faster response time",
      "Batch inference and asynchronous I/O for high-throughput model serving",
    ],
    image: "/projects/neodetect.jpg",
    githubUrl: "https://github.com/adinarayana02",
    liveUrl: "https://adinarayanathota.vercel.app/",
    category: "AI",
    featured: true,
    metrics: {
      latency: "120ms (Inference)",
      costReduction: "60% API Response Time Optimization",
      accuracy: "30% Fraud Capture Gain",
      throughput: "500 docs/min",
      guardrails: "Llama Guard & Fraud Policy Checks",
      tokensProcessed: "3.5M/mo",
    },
    challenges: "Detecting counterfeit signatures, pixel manipulation, and fraudulent text anomalies simultaneously while maintaining sub-second inference speed for high-volume verification.",
    solutions: "Combined DenseNet121 convolutional networks for visual feature extraction with Llama LLMs and RAG pipelines for contextual understanding, and implemented batch inference with asynchronous I/O in FastAPI.",
    architectureSteps: [
      { title: "Document & Image Ingestion", description: "Extracts raw pixel data and high-resolution document scans." },
      { title: "DenseNet121 CNN Feature Extraction", description: "Analyzes tampering artifacts, compression traces, and image authenticity." },
      { title: "RAG Document Comprehension", description: "Vectorizes document content into ChromaDB to verify structural legitimacy." },
      { title: "Llama Reasoning Layer", description: "Cross-verifies textual metadata and checks against compliance policies." },
      { title: "FastAPI Async Serving", description: "Serves predictions via RESTful API with batch inference and async I/O." },
    ],
  },
  {
    title: "KARAM AI",
    slug: "karam-ai",
    description: "Generative AI-Powered Multi-Agent Platform automating enterprise workflows across finance, marketing, customer support, and research.",
    longDescription: "Designed a Generative AI-powered multi-agent platform that automates workflows across finance, marketing, customer support, and research. Integrated AutoGPT-like intelligent agents capable of reasoning, context management, and task orchestration using LLMs + ChromaDB.",
    techStack: ["Python", "FastAPI", "React.js", "ChromaDB", "AutoGPT", "LLMs", "n8n", "LangChain"],
    features: [
      "Generative AI multi-agent platform automating enterprise workflows",
      "AutoGPT-like agents with reasoning, context management, and orchestration",
      "ChromaDB semantic memory and LangChain state machines",
      "n8n workflow integration for cross-platform task automation",
    ],
    image: "/projects/karam-ai.jpg",
    githubUrl: "https://github.com/adinarayana02",
    liveUrl: "https://adinarayanathota.vercel.app/",
    category: "AI",
    featured: true,
    metrics: {
      latency: "180ms (Agent Step)",
      costReduction: "65% Manual Workload Reduction",
      accuracy: "95.8% Task Success",
      throughput: "150 workflows/min",
      guardrails: "Agent Reflection & Multi-Step Verification",
      tokensProcessed: "8.2M/mo",
    },
    challenges: "Preventing hallucination and context drift during multi-step reasoning across diverse enterprise business processes.",
    solutions: "Implemented AutoGPT-style task planner loops with LangChain state machines, ChromaDB semantic memory storage, and n8n webhooks for enterprise tool orchestration.",
    architectureSteps: [
      { title: "Goal Formulation", description: "Deconstructs high-level business goals into sequential sub-tasks." },
      { title: "Multi-Agent Orchestration", description: "Routes sub-tasks to specialized agents (Finance, Marketing, Research)." },
      { title: "ChromaDB Memory", description: "Maintains persistent short-term and long-term agent context." },
      { title: "n8n Automation Dispatch", description: "Executes external actions and platform integrations via webhooks." },
      { title: "Output Consolidation", description: "Synthesizes verified deliverables with reflection and validation." },
    ],
  },
  {
    title: "Multi-Functional AI Chatbot Platform",
    slug: "ai-chatbot-platform",
    description: "Modular Chatbot System with support for General Q&A, PDF Search, Excel Data Analysis, and Notebook Queries.",
    longDescription: "Built a modular chatbot system with support for General Q&A, PDF search, Excel data analysis, and notebook queries. Leveraged FastAPI and real-time NLP techniques to enhance query understanding, resulting in a 40% improvement in user support efficiency.",
    techStack: ["React.js", "FastAPI", "Python", "RAG", "JavaScript", "REST APIs", "OpenAI", "ChromaDB", "Pandas"],
    features: [
      "Modular chatbot system for General Q&A, PDF search, and Excel analysis",
      "Real-time NLP query understanding enhancing user support efficiency by 40%",
      "FastAPI high-speed async backend with ChromaDB vector search",
      "Interactive data charts and notebook query execution",
    ],
    image: "/projects/ai-chatbot-platform.jpg",
    githubUrl: "https://github.com/adinarayana02",
    liveUrl: "https://adinarayanathota.vercel.app/",
    category: "FullStack",
    featured: true,
    metrics: {
      latency: "95ms (Query RT)",
      costReduction: "40% Support Efficiency Gain",
      accuracy: "96.4% Query Understanding",
      throughput: "800 queries/min",
      guardrails: "NLP Intent Validation & Data Sanitization",
      tokensProcessed: "5.1M/mo",
    },
    challenges: "Handling disparate data formats (unstructured PDFs, structured Excel tables, code notebooks) in a single responsive chat interface.",
    solutions: "Built unified ingestion pipelines combining Pandas execution engines for Excel, chunked RAG vector indexing for PDFs, and FastAPI NLP intent routing for conversational Q&A.",
    architectureSteps: [
      { title: "Multi-Modal Document Ingestion", description: "Parses PDFs, Excel sheets, and Jupyter notebooks." },
      { title: "Intent Classification", description: "Routes user queries to tabular analysis or semantic retrieval." },
      { title: "RAG & Tabular Engine", description: "Performs ChromaDB vector search for docs and dynamic Pandas execution for data." },
      { title: "OpenAI LLM Synthesis", description: "Generates structured, cited, and human-like answers." },
      { title: "Streaming React UI", description: "Renders real-time markdown, data tables, and interactive visualizations." },
    ],
  },
  {
    title: "AI-Powered Virtual Try-On System",
    slug: "virtual-tryon",
    description: "Deep Learning Virtual Fitting with Webcam & Image Upload (Hackathon Winner).",
    longDescription: "Award-winning Hackathon project enabling users to virtually try on clothing using live webcam stream or uploaded photos. Features deep learning computer vision pipelines, human pose estimation, and realistic garment texture warping.",
    techStack: ["Python", "TensorFlow", "React.js", "FastAPI", "Computer Vision", "Deep Learning", "OpenCV"],
    features: [
      "Won Hackathon for AI-powered Virtual Try-On system",
      "Enables users to try clothes using webcam or uploaded images",
      "Human pose estimation and 2D-to-3D cloth texture warping",
      "Real-time video frame processing with OpenCV and FastAPI",
    ],
    image: "/projects/virtual-tryon.jpg",
    githubUrl: "https://github.com/adinarayana02",
    liveUrl: "https://adinarayanathota.vercel.app/",
    category: "AI",
    featured: true,
    metrics: {
      latency: "150ms (Frame RT)",
      costReduction: "Instant Fitting Preview",
      accuracy: "94% Pose Alignment",
      throughput: "60 FPS Stream",
      guardrails: "Pose Boundary & Safety Check",
      tokensProcessed: "N/A",
    },
    challenges: "Accurate cloth warping and alignment across diverse human body poses and variable lighting in real-time.",
    solutions: "Integrated pose estimation landmark tracking with garment deformation networks and FastAPI streaming pipelines for instant visual feedback.",
    architectureSteps: [
      { title: "Webcam / Image Capture", description: "Captures user photo or real-time camera video stream." },
      { title: "Pose Estimation Keypoints", description: "Extracts body landmarks and posture contours." },
      { title: "Garment Warping Network", description: "Transforms 2D apparel textures to match 3D body geometry." },
      { title: "Blending & Rendering", description: "Composites garment onto user feed with realistic shading and folds." },
    ],
  },
  {
    title: "B2B AI Business Automation Platform",
    slug: "b2b-ai-automation-platform",
    description: "Multi-agent B2B automation platform featuring Voice Calling Agents, Social Media & SEO Automation, and Lead Management.",
    longDescription: "Enterprise AI-powered business automation platform built during internship at TELIC INFO SERVICES PRIVATE LIMITED. Features multiple specialized AI workflows including an autonomous Voice Calling Agent for customer call interactions and summarization, a Social Media Automation Agent for localized content and video generation, Lead Management pipelines for prospect scoring, and SEO automation for business websites. Engineered using Python, FastAPI, LLM APIs, RAG, ChromaDB, and MLflow for experiment tracking and inference optimization.",
    techStack: ["Python", "FastAPI", "LLM APIs", "RAG", "ChromaDB", "Prompt Orchestration", "MLflow", "Voice AI", "SEO Automation"],
    features: [
      "Autonomous Voice Calling Agent handling customer queries and generating sales follow-up summaries",
      "Social Media Automation Agent producing localized promotional posts and short-form videos",
      "Automated Lead Management workflow identifying and qualifying leads from multi-channel customer interactions",
      "SEO Automation workflow optimizing business website content and search-engine visibility",
      "AI inference pipeline optimization and MLflow experiment tracking and monitoring",
    ],
    image: "/projects/b2b-ai-automation-platform.jpg",
    githubUrl: "https://github.com/adinarayana02",
    liveUrl: "https://adinarayanathota.vercel.app/",
    category: "AI",
    featured: false,
    metrics: {
      latency: "95ms (Inference)",
      costReduction: "50% Operational Cost Reduction",
      accuracy: "94% Intent & Summary Accuracy",
      throughput: "500 calls & leads/hr",
      guardrails: "Prompt Orchestration & Validation",
      tokensProcessed: "4M/mo",
    },
    challenges: "Orchestrating disparate AI workflows (voice calling, social media generation, lead scoring, and SEO) within a unified low-latency architecture while maintaining prompt reliability.",
    solutions: "Architected modular FastAPI microservices with prompt orchestration, RAG with ChromaDB vector search, voice audio pipelines, and tracked pipeline performance and experiments via MLflow.",
    architectureSteps: [
      { title: "Multi-Channel Ingestion", description: "Captures inbound voice calls, social media engagement, and website analytics." },
      { title: "Voice & Language Orchestration", description: "Voice agent handles real-time dialogue, extracts requirements, and generates sales summaries." },
      { title: "Content & SEO Generation", description: "Generates localized social media posts, short-form video scripts, and SEO content." },
      { title: "Lead Management & MLflow Tracking", description: "Qualifies sales leads via vector search and monitors AI experiments with MLflow." },
    ],
  },
];

export const certificates: ICertificate[] = [
  {
    title: "AI Agent Architect & Autonomous Systems",
    organization: "Agentic AI Engineering & LangChain",
    issueDate: "2026",
    description: "Advanced specialization in Multi-Agent workflows, AutoGPT reasoning loops, tool-calling state machines, MCP server protocols, and enterprise n8n orchestration.",
    order: 1,
  },
  {
    title: "LLM Masters: Advanced Generative AI & Fine-Tuning",
    organization: "DeepLearning.AI & OpenAI",
    issueDate: "2026",
    description: "Master-level certification covering LLM architecture, Agentic RAG, RLHF, STT/TTS voice pipelines (Whisper & ElevenLabs), context compression, and ChromaDB vector search.",
    order: 2,
  },
  {
    title: "Advanced RAG & Vector Database Systems",
    organization: "ChromaDB & Vector AI Specialization",
    issueDate: "2025",
    description: "Production-grade hybrid retrieval (dense vectors + sparse BM25), cross-encoder reranking, and self-correcting retrieval pipelines.",
    order: 3,
  },
  {
    title: "Hackathon Winner - AI Virtual Try-On",
    organization: "National Level AI Hackathon",
    issueDate: "2025",
    description: "1st Place Champion for developing an AI-driven computer vision and deep learning apparel fitting system with pose estimation and texture warping.",
    order: 4,
  },
  {
    title: "Student Ambassador & Innovation Lead",
    organization: "Entrepreneur Council",
    issueDate: "2024",
    description: "Leading innovation workshops, mentoring student developers in AI agent architectures, and organizing campus hackathons.",
    order: 5,
  },
];

export interface IEducation {
  institution: string;
  degree: string;
  location?: string;
  period: string;
  grade?: string;
  coursework?: string[];
}

export const education: IEducation[] = [
  {
    institution: "Andhra University",
    degree: "M.Tech in Information Technology",
    location: "Visakhapatnam, Andhra Pradesh, India",
    period: "2024 - 2026",
    grade: "CGPA of 8.5/10",
    coursework: [
      "SDLC",
      "DBMS",
      "Operating Systems",
      "ETL",
      "OOPS",
      "Design Patterns",
      "Machine Learning",
      "Deep Learning",
    ],
  },
  {
    institution: "Vasireddy Venkatadri Institute of Technology",
    degree: "B.Tech in Information Technology",
    location: "Guntur, Andhra Pradesh, India",
    period: "2020 - 2024",
    grade: "CGPA of 7.91/10",
    coursework: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Object-Oriented Programming",
      "Operating Systems",
      "Computer Networks",
    ],
  },
];

// Fallback GitHub data
export const fallbackGitHub = {
  username: "adinarayana02",
  name: "Adinarayana Thota",
  bio: "Developer (AI / ML, Generative AI & AI Agents) | M.Tech IT @ Andhra University",
  publicRepos: 18,
  followers: 12,
  following: 8,
  topRepos: [
    { name: "NeoDetect", description: "Document and image fraud detection system using DenseNet121, Llama & TensorFlow", language: "Python", stars: 5 },
    { name: "KARAM-AI", description: "Generative AI-powered multi-agent automation platform", language: "Python", stars: 4 },
    { name: "AI-Chatbot-Platform", description: "Modular Chatbot with support for Q&A, PDF search & Excel analysis", language: "Python", stars: 3 },
    { name: "Virtual-Try-On", description: "Hackathon Winner: AI-powered Virtual Try-On system using webcam/images", language: "Python", stars: 6 },
  ],
  languages: { Python: 55, JavaScript: 25, HTML: 10, CSS: 10 },
};

// Fallback LeetCode data
export const fallbackLeetCode = {
  username: "adinarayana02",
  totalSolved: 180,
  easySolved: 80,
  mediumSolved: 80,
  hardSolved: 20,
  ranking: 280000,
  totalQuestions: { easy: 800, medium: 1600, hard: 700 },
};

// Substack Blog Articles
export const fallbackBlogs: IBlog[] = [
  {
    title: "AI Benchmarks: Why a Higher Score Doesn’t Always Mean a Better AI Model",
    slug: "ai-benchmarks-why-a-higher-score",
    description: "Every time a new AI model is released, a new leaderboard appears. But a benchmark score is not the same thing as real-world capability. Exploring benchmark contamination, saturation, Goodhart's law, dynamic evaluations, and building workload-specific metrics.",
    content: `Every time a new AI model is released, we see the same pattern. A new leaderboard appears. One model scores 90%, another scores 95%, a new model reaches 100%. The numbers look objective and scientific. And because the models are presented side by side, it is tempting to conclude: **Higher score = better AI**.

But that conclusion is much more complicated than it looks. A benchmark is useful—but **a benchmark score is not the same thing as real-world capability**.

---

### What Exactly Is an AI Benchmark?
At the simplest level, a benchmark is an **evaluation designed to measure a particular capability of an AI system**. A benchmark might ask an AI model to:
- Answer multiple-choice questions (e.g. MMLU)
- Solve mathematical problems
- Generate or repair code (e.g. SWE-bench)
- Understand documents and follow instructions
- Use external tools and navigate websites
- Complete multi-step agentic tasks

Without benchmarks, comparing AI systems would be much harder. But here's the crucial distinction: **A benchmark measures performance on the benchmark.** It does not automatically measure everything we mean by intelligence or production fitness.

---

### The First Major Problem: Benchmark Contamination
Modern AI models are trained on enormous amounts of web data, code, books, and Q&A forums. Over time, parts of public benchmarks can leak into training datasets.

Is the model reasoning and solving the benchmark, or has it memorized the answers?
- **Memorization**: The model reproduces a pattern it previously encountered.
- **Generalization**: The model understands the underlying concept and invents a solution for a novel situation.

When researchers created **MMLU-CF** (a contamination-free test set), model scores dropped significantly and leaderboard rankings shifted.

---

### The Second Problem: Benchmark Saturation
When models become extremely strong on an older benchmark, the benchmark reaches a ceiling. A 2-point difference (95% vs 97%) provides almost no insight into how the model behaves on messy enterprise edge cases.

---

### The Third Problem: Benchmark Gaming & Goodhart's Law
When a measure becomes the target, AI systems can optimize for the metric rather than the capability. Researchers have documented how models can exploit test runners (such as pytest \`conftest.py\` bypasses in agent benchmarks) to achieve 100% scores without completing the underlying software engineering task.

---

### What Should You Measure Instead?
If you are deploying AI in production (e.g., a RAG pipeline or Agentic automation):
1. **Retrieval**: Precision, recall, citation accuracy, context relevance.
2. **Generation**: Faithfulness, groundedness, hallucination rate.
3. **System Performance**: P95 latency, cost per request, token throughput.
4. **User Experience**: Task completion rate, human intervention frequency.

**Don't worship the leaderboard.** The best benchmark is your own workload.`,
    coverImage: "",
    tags: ["AI Benchmarks", "LLM Evaluation", "MMLU", "SWE-bench", "System Design"],
    source: "article",
    externalUrl: "https://thotaadinarayana.substack.com/p/ai-benchmarks-why-a-higher-score",
    published: true,
    publishedAt: new Date("2026-09-25T13:04:47Z"),
    readingTime: 6,
  },
  {
    title: "Fine-Tuning an AI Voice Agent: From Audio Dataset to Production",
    slug: "fine-tuning-an-ai-voice-agent-from",
    description: "Production-grade AI voice agents require speech understanding, conversational reasoning, real-time tool calling, and expressive synthesis. A complete guide from dataset curation and audio validation to STT, LLM, and TTS fine-tuning.",
    content: `AI voice agents are moving beyond simple speech-to-text and text-to-speech pipelines. A production-grade voice agent needs to understand spoken input, reason about the conversation, retrieve accurate information via RAG, execute actions, and respond with natural latency and consistent tone.

---

### Core Voice Agent Architecture
\`\`\`
Customer Voice -> STT (Speech-to-Text) -> LLM (Reasoning & Memory)
                       |
               RAG + Tool Calling + Database
                       |
                  Response Text -> TTS (Voice Synthesis) -> Audio Stream
\`\`\`

Each component serves a dedicated responsibility:
- **STT (Speech-to-Text)**: What did the customer say? (OpenAI Whisper, Conformer)
- **LLM**: What should the agent say or do? (Llama, GPT-4, Function Calling)
- **RAG / Tools**: What real-time business data is needed? (ChromaDB, Booking APIs)
- **TTS**: How should the response sound? (Speech synthesis & expressive acoustics)

---

### Fine-Tuning vs Prompting vs RAG
- **Prompting**: Directs the persona and conversation style.
- **RAG**: Delivers dynamic business data (e.g., room availability, policy updates) without retraining.
- **Fine-Tuning**: Adapts the core model weights for specialized vocabulary, domain acoustics, or custom voice timbres.

---

### Audio Dataset: The Foundation
A high-quality voice dataset consists of aligned audio-text pairs:
\`\`\`
dataset/
├── audio/
│   ├── 001.wav
│   ├── 002.wav
└── metadata.csv (audio, text)
\`\`\`

Data preprocessing involves removing clipping, normalizing sample rates (e.g. 24kHz / 48kHz mono WAV), trimming silence with \`librosa\`, and filtering empty or noisy transcripts. 1,000 clean studio-grade samples often outperform 10,000 noisy clips.

---

### Key Takeaways for AI Voice Engineering
1. Do not fine-tune dynamic facts—use RAG and APIs.
2. Fine-tune STT when encountering high error rates on domain acronyms.
3. Fine-tune TTS or use speaker adapters for brand-consistent vocal identities.`,
    coverImage: "",
    tags: ["Voice AI", "Fine-Tuning", "Speech-to-Text", "TTS", "Whisper", "LangChain"],
    source: "article",
    externalUrl: "https://thotaadinarayana.substack.com/p/fine-tuning-an-ai-voice-agent-from",
    published: true,
    publishedAt: new Date("2026-09-09T12:40:22Z"),
    readingTime: 7,
  },
  {
    title: "Hermes Agent: From AI Chatbot to a Customizable AI Agent",
    slug: "hermes-agent-from-ai-chatbot-to-a",
    description: "Explore how autonomous AI agents transcend traditional chat interfaces using persistent memory (MEMORY.md), dynamic tool execution, reusable skills, MCP server connectivity, and cron automations.",
    content: `AI assistants are moving beyond simple question-and-answer interfaces. Instead of only generating a single textual response, modern agent systems can search for information, interact with operating system environments, read and edit files, maintain persistent context across sessions, and execute recurring jobs.

One compelling project in this space is **Hermes Agent** (by Nous Research), designed as an extensible agent framework.

---

### From Chatbots to Autonomous Agents
- **Chatbot**: User -> Prompt -> LLM -> Answer
- **Agent**: User -> Goal -> Planner -> Tool Execution -> Observation -> Memory Update -> Final Deliverable

---

### Key Architectural Pillars of Hermes
1. **Persistent Memory (\`MEMORY.md\` & \`USER.md\`)**: Preserves project conventions and user preferences across distinct sessions.
2. **Dynamic Toolset**: Supports file manipulation, web search, terminal execution, code interpreters, and delegation.
3. **Skills as Procedural Memory**: Reusable workflow templates (e.g. \`/learn\` command) that convert repetitive multi-step processes into instant capabilities.
4. **Model Context Protocol (MCP)**: Standardized protocol connecting the agent to external databases, GitHub repos, and custom API services.
5. **Scheduled Cron Tasks**: Triggers background proactive research and system monitoring on recurring schedules.

---

### Why Custom Agent Platforms Matter
The future of AI development is not just about raw model parameter scale—it is about orchestrating reasoning loops, reliable tool calling, and long-term memory to solve complex, multi-stage problems autonomously.`,
    coverImage: "",
    tags: ["AI Agents", "MCP", "Autonomous Workflows", "Memory", "Nous Research"],
    source: "article",
    externalUrl: "https://thotaadinarayana.substack.com/p/hermes-agent-from-ai-chatbot-to-a",
    published: true,
    publishedAt: new Date("2026-09-02T12:53:21Z"),
    readingTime: 6,
  },
  {
    title: "Advanced RAG: How to Build Better Retrieval Pipelines",
    slug: "advanced-rag-how-to-build-better",
    description: "Move beyond basic naive vector search. A comprehensive exploration of Query Transformation, Multi-Query expansion, Hybrid Search (BM25 + Dense Vectors), Cross-Encoder Reranking, and Context Compression.",
    content: `Retrieval-Augmented Generation (RAG) is one of the most practical architectures for building AI applications that need external or proprietary knowledge.

However, naive RAG (single vector search -> top-k docs -> prompt) regularly fails on nuanced queries with multiple constraints (e.g. *"Spicy chicken biryani under ₹300"*).

---

### The Advanced RAG Pipeline
\`\`\`
User Query
    ↓
Query Transformation (Rewriting / Decomposition)
    ↓
Multi-Query Generation
    ↓
Hybrid Search (Dense Vector + Sparse Keyword BM25)
    ↓
Candidate Set (Top 20-50)
    ↓
Cross-Encoder Reranking
    ↓
Context Filtering & Compression (Remove noise)
    ↓
LLM Synthesis -> Accurate Answer with Citations
\`\`\`

---

### Core Techniques
1. **Query Transformation**: Reformulates conversational user queries into clean, retrieval-friendly keywords.
2. **Multi-Query Retrieval**: Expands a single intent into diverse sub-queries to maximize recall coverage.
3. **Hybrid Search**: Combines semantic embeddings (conceptual similarity) with BM25 keyword matching (exact product names, IDs, SKUs).
4. **Cross-Encoder Reranking**: Evaluates query-document pairs jointly to rank the highest relevance items at the top.
5. **Context Compression**: Strips extraneous boilerplates from retrieved chunks to minimize token cost and LLM attention distraction.

---

### Quality Principle
**Better LLM ≠ Automatically Better RAG.** Invest in retrieval hygiene and ranking quality to build rock-solid AI systems.`,
    coverImage: "",
    tags: ["Advanced RAG", "Vector DBs", "Hybrid Search", "Reranking", "Context Compression"],
    source: "article",
    externalUrl: "https://thotaadinarayana.substack.com/p/advanced-rag-how-to-build-better",
    published: true,
    publishedAt: new Date("2026-08-29T12:01:21Z"),
    readingTime: 8,
  },
  {
    title: "Agentic RAG Explained: Architecture, Workflow, and Real-World Implementation",
    slug: "agentic-rag-explained-architecture",
    description: "An in-depth breakdown comparing traditional RAG, advanced RAG, and agentic RAG. Learn how autonomous agents dynamically plan queries, route across vector and SQL sources, verify facts, and self-correct.",
    content: `When answering complex enterprise queries requiring information from multiple disparate sources (e.g. internal guidelines in ChromaDB, real-time benchmarks from the web, and billing data in SQL), static RAG pipelines fail.

---

### Traditional RAG vs Agentic RAG
- **Traditional / Advanced RAG**: Follows a fixed, linear execution graph.
- **Agentic RAG**: Empowers an LLM agent with reasoning loops, query routing, tool dispatching, evaluation checkpoints, and recursive self-correction.

\`\`\`
User Complex Query
        ↓
Agent Intent & Routing Decision
   ┌────┴───────────────────────────┐
   ↓                                ↓
Vector DB (Docs)             SQL DB / Live APIs
   └────┬───────────────────────────┘
        ↓
Evidence Evaluation: Is Information Complete?
   ├── NO  -> Reformulate & Query Missing Aspects
   └── YES -> Consolidate & Generate Final Response
\`\`\`

---

### Key Workflow Patterns
- **Routing**: Classifies query intent and directs requests to appropriate retrieval backends.
- **Orchestrator-Workers**: Spawns concurrent sub-agents for multi-domain synthesis.
- **Evaluator-Optimizer**: Verifies generated output against grounded citations before returning to the user.`,
    coverImage: "",
    tags: ["Agentic RAG", "Multi-Agent Systems", "FastAPI", "ChromaDB", "LLMs"],
    source: "article",
    externalUrl: "https://thotaadinarayana.substack.com/p/agentic-rag-explained-architecture",
    published: true,
    publishedAt: new Date("2026-08-25T12:43:47Z"),
    readingTime: 7,
  },
  {
    title: "Personal AI Assistant Built with n8n & Telegram",
    slug: "personal-ai-assistant-n8n-telegram",
    description: "Build an autonomous personal AI assistant on Telegram using n8n workflows, OpenAI Whisper for voice notes, Pinecone vector search for semantic recall, and ElevenLabs realistic voice generation.",
    content: `Learn how to construct a modular, production-ready AI assistant directly integrated into Telegram.

### Key Architecture Highlights:
- **Telegram Bot Webhook**: Intercepts text queries and raw audio voice notes.
- **OpenAI Whisper STT**: Transcribes spoken audio into actionable prompt text.
- **n8n Orchestrator**: Manages state, conditional branching, and LLM tool execution.
- **Pinecone Vector Memory**: Stores contextual history and semantic document embeddings.
- **ElevenLabs Speech Synthesis**: Renders expressive voice responses back to the user.

Check out the full workflow breakdown and step-by-step tutorial on LinkedIn!`,
    coverImage: "",
    tags: ["AIAgent", "n8n", "VoiceAI", "TelegramBot", "OpenAI", "Pinecone"],
    source: "linkedin",
    externalUrl: "https://lnkd.in/p/dDZugJWA",
    linkedinPostId: "urn:li:share:7325345125843230720",
    published: true,
    publishedAt: new Date("2026-05-10T10:00:00Z"),
    readingTime: 5,
  },
  {
    title: "Build Your Own AI Marketing Asset Generator with n8n & GPT-4",
    slug: "ai-marketing-asset-generator-n8n-gpt4",
    description: "Create an automated marketing visual and copywriting generator using n8n, OpenAI GPT-4, and image generation APIs to produce branded banners, ad copies, and campaign assets on autopilot.",
    content: `Discover how to automate end-to-end multi-channel marketing campaigns using generative AI pipelines.

### Capabilities:
- **Automated Copywriting**: Generates targeted headlines, hook copies, and email templates using tailored GPT-4 prompts.
- **Asset Visual Generation**: Automates multi-format graphic synthesis for Twitter, LinkedIn, and Instagram.
- **n8n Automation Flow**: Seamlessly dispatches produced assets to marketing channels and cloud storage.

Explore the complete system blueprint on LinkedIn!`,
    coverImage: "",
    tags: ["AIAgent", "n8n", "ImageAI", "MarketingAutomation", "OpenAI", "GPT4"],
    source: "linkedin",
    externalUrl: "https://lnkd.in/p/dFnpHqFp",
    linkedinPostId: "urn:li:share:7328731852452573185",
    published: true,
    publishedAt: new Date("2026-05-20T10:00:00Z"),
    readingTime: 6,
  },
  {
    title: "System Design Series: Understanding Low Level Design (LLD)",
    slug: "system-design-understanding-low-level-design-lld",
    description: "Comprehensive handnotes on Low-Level Design (LLD): mastering Object-Oriented Programming (OOP), SOLID principles, Design Patterns (Factory, Strategy, Observer, Decorator), and class diagrams for scalable software.",
    content: `A thorough foundation in Low-Level Design (LLD) is essential for engineering robust, extensible software systems.

### Core Pillars:
1. **Object-Oriented Programming**: Encapsulation, Abstraction, Inheritance, and Polymorphism in real-world scenarios.
2. **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
3. **Design Patterns**: Factory, Strategy, Observer, Decorator, and Singleton patterns with clean code diagrams.

Read the complete handnotes and visual diagrams on LinkedIn!`,
    coverImage: "",
    tags: ["SystemDesign", "LowLevelDesign", "OOP", "SOLIDPrinciples", "DesignPatterns"],
    source: "linkedin",
    externalUrl: "https://lnkd.in/p/dVgPau2S",
    linkedinPostId: "urn:li:share:7435511473076047872",
    published: true,
    publishedAt: new Date("2026-06-15T10:00:00Z"),
    readingTime: 7,
  },
  {
    title: "Mastering System Design: From HLD to LLD for Backend Engineers",
    slug: "mastering-system-design-hld-to-lld",
    description: "Bridging High-Level Architecture (HLD) with Low-Level Design (LLD). Deep dive into load balancers, caching strategies (Redis), database sharding, CAP theorem, message queues (Kafka), and microservices patterns.",
    content: `Bridge the gap between distributed systems architecture and clean class-level implementation.

### Key Architectural Concepts:
- **Scalability & Load Balancing**: Horizontal vs. Vertical scaling, Layer 4 vs. Layer 7 balancing.
- **Caching & Consistency**: Cache-aside, write-through strategies, Redis distributed caching, and CAP theorem trade-offs.
- **Decoupled Messaging**: Asynchronous event streams with Kafka and RabbitMQ.
- **Microservices & Resiliency**: Circuit breakers, rate limiters, and fault-tolerant service communication.

Check out the full guide and architecture cheat sheet on LinkedIn!`,
    coverImage: "",
    tags: ["SystemDesign", "BackendDevelopment", "HLD", "LLD", "Microservices", "Scalability"],
    source: "linkedin",
    externalUrl: "https://lnkd.in/p/dTJygtkC",
    linkedinPostId: "urn:li:share:7435511473076047873",
    published: true,
    publishedAt: new Date("2026-07-02T10:00:00Z"),
    readingTime: 8,
  },
];

