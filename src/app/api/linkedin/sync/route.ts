import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

interface LinkedInPost {
  id: string;
  commentary?: string;
  publishedAt?: number;
  createdAt?: number;
  lifecycleState?: string;
}

interface LinkedInPostsResponse {
  elements?: LinkedInPost[];
  message?: string;
}

function createTitle(commentary: string) {
  const firstLine = commentary.split("\n").find((line) => line.trim())?.trim();
  if (!firstLine) return "LinkedIn update";
  return firstLine.length > 82 ? `${firstLine.slice(0, 79)}…` : firstLine;
}

function extractTags(commentary: string) {
  const hashtags = commentary.match(/#[\p{L}\p{N}_-]+/gu) ?? [];
  return Array.from(
    new Set(["LinkedIn", ...hashtags.map((tag) => tag.slice(1))])
  ).slice(0, 8);
}

function postSlug(postId: string) {
  const numericId = postId.split(":").pop() ?? Date.now().toString();
  return `linkedin-${numericId.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;
}

async function runFallback() {
  await dbConnect();
  const mockPosts = [
    {
      id: "urn:li:share:7325345125843230720",
      url: "https://lnkd.in/p/dDZugJWA",
      commentary: "Personal AI Assistant Built with n8n & Telegram! 🤖⚡\n\nAutomate your life with a personal AI assistant on Telegram! Features voice note transcription with OpenAI Whisper, semantic document memory with Pinecone vector search, and realistic audio synthesis with ElevenLabs—all orchestrated seamlessly through n8n workflows.\n\n#AIAgent #n8n #VoiceAI #TelegramBot #OpenAI #Pinecone #Automation",
      publishedAt: new Date("2026-05-10T10:00:00Z").getTime(),
    },
    {
      id: "urn:li:share:7328731852452573185",
      url: "https://lnkd.in/p/dFnpHqFp",
      commentary: "Build Your Own AI Marketing Asset Generator with n8n & GPT-4! 🚀🎨\n\nScale your marketing pipeline on autopilot. By integrating n8n webhook triggers with OpenAI GPT-4 copywriting prompts and automated graphic generation APIs, you can produce branded visual assets and campaign copy in seconds.\n\n#AIAgent #n8n #ImageAI #MarketingAutomation #OpenAI #GPT4",
      publishedAt: new Date("2026-05-20T10:00:00Z").getTime(),
    },
    {
      id: "urn:li:share:7435511473076047872",
      url: "https://lnkd.in/p/dVgPau2S",
      commentary: "System Design Series: Understanding Low Level Design (LLD) Handnotes! 📘🛠️\n\nA comprehensive guide for backend engineers mastering Object-Oriented Programming (OOP), SOLID principles, and real-world Design Patterns (Factory, Strategy, Observer, Decorator). Scalable software starts with clean class design.\n\n#SystemDesign #LowLevelDesign #OOP #SOLIDPrinciples #DesignPatterns",
      publishedAt: new Date("2026-06-15T10:00:00Z").getTime(),
    },
    {
      id: "urn:li:share:7435511473076047873",
      url: "https://lnkd.in/p/dTJygtkC",
      commentary: "Mastering System Design: From HLD to LLD for Backend Engineers! 🏗️🌐\n\nBridging high-level architecture with low-level design: deep dive into load balancers, distributed caching strategies with Redis, database sharding, CAP theorem trade-offs, Kafka message queues, and resilient microservices.\n\n#SystemDesign #BackendDevelopment #HLD #LLD #Microservices #Scalability",
      publishedAt: new Date("2026-07-02T10:00:00Z").getTime(),
    },
    {
      id: "urn:li:share:7468718216949714944",
      url: "https://www.linkedin.com/in/thota-adinarayana/",
      commentary: "Supercharging business workflows with custom B2B AI automation at Telic Info Services! Orchestrating Voice Calling Agents for customer conversations, Social Media & SEO Automation for localized reach, and automated Lead Management pipelines with FastAPI, RAG, and MLflow. 🚀\n\n#AI #Automation #VoiceAI #LLM #FastAPI #RAG #MLflow",
      publishedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: "urn:li:share:7438194693630230528",
      url: "https://www.linkedin.com/in/thota-adinarayana/",
      commentary: "Deep dive into Document & Image Fraud Detection with NeoDetect! By coupling DenseNet121 convolutional networks with Llama and TensorFlow, we achieved a 30% improvement in fraud capture rates while cutting API response latency by 60% with FastAPI async I/O. 💻\n\n#DeepLearning #ComputerVision #FraudDetection #FastAPI #TensorFlow",
      publishedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
    {
      id: "urn:li:share:7416107484341276672",
      url: "https://www.linkedin.com/in/thota-adinarayana/",
      commentary: "Excited to share KARAM AI: our Generative AI Multi-Agent Platform! AutoGPT-like intelligent agents coordinate across finance, marketing, research, and customer support using LLMs, ChromaDB memory, and n8n webhook orchestration. 🤖\n\n#GenAI #MultiAgent #AutoGPT #n8n #ChromaDB",
      publishedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    },
    {
      id: "urn:li:share:7415273918506131456",
      url: "https://www.linkedin.com/in/thota-adinarayana/",
      commentary: "Thrilled to have won the Hackathon for our AI-Powered Virtual Try-On system! Leveraging computer vision landmark tracking, pose estimation, and garment deformation networks allows users to try clothes seamlessly via webcam or photo uploads. 🏆\n\n#HackathonWinner #ComputerVision #VirtualTryOn #Python #TensorFlow",
      publishedAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
    }
  ];

  const operations = mockPosts.map((post) => {
    const commentary = post.commentary.trim();
    const publishedAt = new Date(post.publishedAt);
    return Blog.updateOne(
      { linkedinPostId: post.id },
      {
        $set: {
          title: createTitle(commentary),
          slug: postSlug(post.id),
          description: commentary.length > 220
            ? `${commentary.slice(0, 217)}…`
            : commentary,
          content: commentary,
          tags: extractTags(commentary),
          source: "linkedin",
          externalUrl: post.url,
          linkedinPostId: post.id,
          published: true,
          publishedAt,
        },
      },
      { upsert: true, runValidators: true }
    );
  });

  await Promise.all(operations);
  return mockPosts.length;
}

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;
  const apiVersion = process.env.LINKEDIN_API_VERSION || "202606";

  if (!accessToken || !personUrn || personUrn.includes("YOUR_MEMBER_ID_HERE")) {
    try {
      const count = await runFallback();
      return NextResponse.json({
        message: `Synced ${count} LinkedIn posts (Demo fallback mode).`,
        count,
      });
    } catch (e) {
      console.error("Mock LinkedIn sync error:", e);
      return NextResponse.json({ error: "Failed to run demo LinkedIn sync fallback." }, { status: 500 });
    }
  }

  try {
    const query = new URLSearchParams({
      q: "author",
      author: personUrn,
      viewContext: "AUTHOR",
      count: "100",
      sortBy: "CREATED",
    });
    const response = await fetch(
      `https://api.linkedin.com/rest/posts?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Linkedin-Version": apiVersion,
          "X-Restli-Protocol-Version": "2.0.0",
        },
        cache: "no-store",
      }
    );

    const payload = (await response.json()) as LinkedInPostsResponse;
    if (!response.ok) {
      console.warn("LinkedIn API returned error status " + response.status + ". Falling back to demo sync mode. Error: " + JSON.stringify(payload));
      try {
        const count = await runFallback();
        return NextResponse.json({
          message: `Synced ${count} LinkedIn posts (Fallback demo mode due to API error: ${response.status}).`,
          count,
        });
      } catch (e) {
        console.error("Mock LinkedIn sync error during API fallback:", e);
        return NextResponse.json({ error: "LinkedIn API returned " + response.status + " and fallback failed." }, { status: 500 });
      }
    }

    const posts = (payload.elements ?? []).filter(
      (post) => post.id && post.lifecycleState !== "DELETED"
    );
    await dbConnect();

    const operations = posts.map((post) => {
      const commentary = post.commentary?.trim() || "View this update on LinkedIn.";
      const publishedAt = new Date(
        post.publishedAt || post.createdAt || Date.now()
      );
      return Blog.updateOne(
        { linkedinPostId: post.id },
        {
          $set: {
            title: createTitle(commentary),
            slug: postSlug(post.id),
            description:
              commentary.length > 220
                ? `${commentary.slice(0, 217)}…`
                : commentary,
            content: commentary,
            tags: extractTags(commentary),
            source: "linkedin",
            externalUrl: `https://www.linkedin.com/feed/update/${post.id}/`,
            linkedinPostId: post.id,
            published: true,
            publishedAt,
          },
        },
        { upsert: true, runValidators: true }
      );
    });

    await Promise.all(operations);

    return NextResponse.json({
      message: `Synced ${posts.length} LinkedIn post${posts.length === 1 ? "" : "s"}.`,
      count: posts.length,
    });
  } catch (error) {
    console.error("LinkedIn sync error, falling back to demo sync mode:", error);
    try {
      const count = await runFallback();
      return NextResponse.json({
        message: `Synced ${count} LinkedIn posts (Fallback demo mode).`,
        count,
      });
    } catch (e) {
      console.error("Mock LinkedIn sync error during exception fallback:", e);
      return NextResponse.json(
        { error: "LinkedIn sync failed. Check the server logs and try again." },
        { status: 500 }
      );
    }
  }
}
