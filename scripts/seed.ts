import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Load .env manually to ensure it connects to MongoDB Atlas
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
        if (key && !key.startsWith("#")) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.warn("Failed to load .env manually:", e);
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "thotaadinarayana02@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Import models
    const User = (await import("../src/models/User")).default;
    const Project = (await import("../src/models/Project")).default;
    const Certificate = (await import("../src/models/Certificate")).default;
    const Experience = (await import("../src/models/Experience")).default;
    const Skill = (await import("../src/models/Skill")).default;
    const Profile = (await import("../src/models/Profile")).default;
    const Resume = (await import("../src/models/Resume")).default;
    const Blog = (await import("../src/models/Blog")).default;
    const { fallbackBlogs } = await import("../src/lib/constants");

    // Seed Admin User
    const existingUser = await User.findOne({ email: ADMIN_EMAIL });
    if (!existingUser) {
      await User.create({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: "Adinarayana Thota",
        role: "admin",
      });
      console.log("✅ Admin user created");
    } else {
      existingUser.password = ADMIN_PASSWORD;
      await existingUser.save();
      console.log("✅ Admin user password reset successfully");
    }

    // Seed Profile (Truncate and recreate to sync with resume)
    await Profile.deleteMany({});
    const newUrl = "https://adinarayanathota.vercel.app/";
    await Profile.create({
      name: "Adinarayana Thota",
      title: "Developer (AI / ML, Data Engineering)",
      bio: "AI/ML and Data Engineering Developer specializing in Generative AI, Multi-Agent Systems, RAG pipelines, and scalable APIs. Pursuing M.Tech in Information Technology at Andhra University with a proven track record in end-to-end AI recruitment tools, fraud detection, and multi-agent platforms.",
      email: "thotaadinarayana02@gmail.com",
      phone: "+91 8309871401",
      location: "Andhra Pradesh, India",
      logoColor1: "#6366f1",
      logoColor2: "#22d3ee",
      linkedinUrl: "https://www.linkedin.com/in/thota-adinarayana/",
      githubUrl: "https://github.com/adinarayana02",
      githubUsername: "adinarayana02",
      leetcodeUrl: "https://leetcode.com",
      leetcodeUsername: "adinarayana02",
      resumeUrl: newUrl,
    });
    console.log("✅ Profile seeded");

    // Seed Projects (Truncate and recreate to sync with resume)
    await Project.deleteMany({});
    await Project.insertMany([
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
        order: 1,
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
        order: 2,
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
        order: 3,
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
        description: "Document & Image Fraud Detection System using DenseNet121, Llama, and TensorFlow.",
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
        order: 4,
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
        description: "AI Automation Multi-Agent Platform powered by Generative AI.",
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
        order: 5,
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
        description: "Modular AI Chatbot Platform for Q&A, PDF search, Excel analytics & notebook querying.",
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
        order: 6,
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
        order: 7,
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
        order: 8,
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
    ]);
    console.log("✅ Projects seeded");

    // Seed Experience (Truncate and recreate to sync with resume)
    await Experience.deleteMany({});
    await Experience.insertMany([
      {
        company: "TELIC INFO SERVICES PRIVATE LIMITED",
        role: "Developer (AI / ML, Generative AI)",
        type: "Internship",
        location: "India",
        startDate: "2026-01-01",
        endDate: "2026-05-31",
        current: false,
        bullets: [
          "Engineered a B2B AI-powered business automation platform orchestrating multiple specialized AI workflows across sales, lead management, marketing, and SEO.",
          "Developed an AI Voice Calling Agent that interacts with customers over calls, handles real-time queries, extracts key info, and generates structured conversation summaries for sales team follow-ups.",
          "Built a Social Media Automation Agent to generate localized promotional posts and short-form video content targeting region-specific customer segments.",
          "Designed an automated Lead Management pipeline that leverages customer interaction data to identify, qualify, and manage high-intent sales leads.",
          "Created an SEO Automation workflow for business websites and built end-to-end AI pipelines using Python, FastAPI, LLM APIs, RAG, ChromaDB vector search, and prompt orchestration while optimizing inference and tracking experiments via MLflow.",
        ],
        technologies: ["Python", "FastAPI", "LLM APIs", "RAG", "Vector Search", "ChromaDB", "Prompt Orchestration", "MLflow", "Voice AI", "SEO Automation"],
        order: 1,
      },
      {
        company: "Afrov Pvt Limited",
        role: "Data Science Intern",
        type: "Internship",
        location: "India",
        startDate: "2025-07-01",
        endDate: "2025-11-30",
        current: false,
        bullets: [
          "Architected NeoDetect, a document and image fraud detection system to identify potentially fraudulent or manipulated documents.",
          "Built visual analysis pipeline using DenseNet121 with TensorFlow to extract image features and identify forgery patterns in document images.",
          "Integrated Llama with a Retrieval-Augmented Generation (RAG) pipeline to retrieve knowledge context and perform deep semantic document comprehension.",
          "Exposed core AI capabilities via high-performance FastAPI REST APIs for seamless document ingestion and real-time fraud scoring.",
          "Optimized inference workflows using batch inference and asynchronous I/O, substantially reducing overall API response times.",
        ],
        technologies: ["Python", "TensorFlow", "DenseNet121", "Llama", "RAG", "FastAPI", "Computer Vision", "Async I/O", "Fraud Detection"],
        order: 2,
      },
    ]);
    console.log("✅ Experience seeded");

    // Seed Skills
    await Skill.deleteMany({});
    const skills = [
      { name: "Python", category: "Programming Languages", icon: "terminal", proficiency: 95, order: 1 },
      { name: "JavaScript", category: "Programming Languages", icon: "file-type", proficiency: 85, order: 2 },
      { name: "HTML & CSS", category: "Programming Languages", icon: "file-code", proficiency: 90, order: 3 },
      { name: "React.js", category: "Frontend", icon: "atom", proficiency: 85, order: 4 },
      { name: "FastAPI", category: "Backend", icon: "zap", proficiency: 90, order: 5 },
      { name: "Django", category: "Backend", icon: "server", proficiency: 80, order: 6 },
      { name: "REST APIs", category: "Backend", icon: "network", proficiency: 90, order: 7 },
      { name: "TensorFlow", category: "AI/ML & Deep Learning", icon: "brain", proficiency: 85, order: 8 },
      { name: "DenseNet121", category: "AI/ML & Deep Learning", icon: "cpu", proficiency: 85, order: 9 },
      { name: "Scikit-learn", category: "AI/ML & Deep Learning", icon: "settings", proficiency: 85, order: 10 },
      { name: "Pandas & NumPy", category: "AI/ML & Deep Learning", icon: "bar-chart-3", proficiency: 90, order: 11 },
      { name: "OpenAI Whisper", category: "AI/ML & Deep Learning", icon: "mic", proficiency: 85, order: 12 },
      { name: "LLMs & Llama", category: "Generative AI", icon: "bot", proficiency: 90, order: 13 },
      { name: "RAG & Vector Search", category: "Generative AI", icon: "search", proficiency: 95, order: 14 },
      { name: "LangChain", category: "Generative AI", icon: "link", proficiency: 90, order: 15 },
      { name: "ChromaDB", category: "Generative AI", icon: "database", proficiency: 90, order: 16 },
      { name: "AutoGPT & Multi-Agent", category: "Generative AI", icon: "workflow", proficiency: 85, order: 17 },
      { name: "n8n Automation", category: "Generative AI", icon: "workflow", proficiency: 80, order: 18 },
      { name: "MySQL & PostgreSQL", category: "Database & Cloud", icon: "table", proficiency: 85, order: 19 },
      { name: "AWS & Docker", category: "Database & Cloud", icon: "cloud", proficiency: 80, order: 20 },
      { name: "Git", category: "Tools & Principles", icon: "git-merge", proficiency: 90, order: 21 },
    ];
    await Skill.insertMany(skills);
    console.log("✅ Skills seeded");

    // Seed Certificates
    await Certificate.deleteMany({});
    await Certificate.insertMany([
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
        issueDate: "2026",
        description: "Production-grade hybrid retrieval (dense vectors + sparse BM25), cross-encoder reranking, and self-correcting retrieval pipelines.",
        order: 3,
      },
      {
        title: "Hackathon Winner - AI Virtual Try-On",
        organization: "National Level AI Hackathon",
        issueDate: "2026",
        description: "1st Place Champion for developing an AI-driven computer vision and deep learning apparel fitting system with pose estimation and texture warping.",
        order: 4,
      },
      {
        title: "AWS Cloud Foundations & AI Infrastructure",
        organization: "Amazon Web Services (AWS)",
        issueDate: "2026",
        description: "Cloud architecture, distributed model serving pipelines, asynchronous microservices, Docker containerization, and AWS deployment.",
        order: 5,
      },
      {
        title: "FastAPI RESTful Backend Engineering",
        organization: "API Architecture & Systems Design Council",
        issueDate: "2026",
        description: "High-concurrency async APIs, batch inference optimization, WebSocket streaming, and distributed microservices architecture.",
        order: 6,
      },
      {
        title: "Deep Learning & Computer Vision",
        organization: "TensorFlow & AI Specialization",
        issueDate: "2026",
        description: "Convolutional neural networks, DenseNet121 feature extractors, object detection, and multimodal computer vision pipelines.",
        order: 7,
      },
      {
        title: "Student Ambassador & Innovation Lead",
        organization: "Entrepreneur Council",
        issueDate: "2026",
        description: "Leading innovation workshops, mentoring student developers in AI agent architectures, and organizing campus hackathons.",
        order: 8,
      },
    ]);
    console.log("✅ Certificates seeded");

    // Seed Blogs (Substack articles)
    await Blog.deleteMany({});
    await Blog.insertMany(fallbackBlogs);
    console.log("✅ Substack Blogs seeded");

    console.log("\n🚀 All database tables seeded successfully for Adinarayana Thota!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
