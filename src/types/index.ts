export interface IProject {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  features: string[];
  githubUrl: string;
  liveUrl: string;
  image?: string;
  screenshots?: string[];
  category: "AI" | "FullStack" | "WebApp" | "Backend" | "Automation" | "Resume";
  featured: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
  metrics?: Record<string, string>;
  challenges?: string;
  solutions?: string;
  architectureSteps?: { title: string; description: string }[];
}

export interface ICertificate {
  _id?: string;
  title: string;
  organization: string;
  issueDate?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
  order?: number;
  createdAt?: Date;
}

export interface IExperience {
  _id?: string;
  company: string;
  role: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  location: string;
  startDate: string;
  endDate: string;
  period?: string;
  current: boolean;
  bullets: string[];
  technologies: string[];
  order?: number;
  createdAt?: Date;
}

export interface ISkill {
  _id?: string;
  name: string;
  category: string;
  icon?: string;
  proficiency?: number;
  order?: number;
  createdAt?: Date;
}

export interface IJobPost {
  _id?: string;
  company: string;
  role: string;
  type: "Full-time" | "Part-time" | "Internship" | "Remote" | "Hybrid";
  location: string;
  description: string;
  applicationUrl?: string;
  status: "Applied" | "Interviewing" | "Selected" | "Rejected" | "Saved" | "Interested";
  isPublic: boolean;
  appliedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage?: string;
  tags: string[];
  source?: "article" | "linkedin";
  externalUrl?: string;
  linkedinPostId?: string;
  published: boolean;
  publishedAt?: Date;
  readingTime?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactMessage {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt?: Date;
}

export interface IResume {
  _id?: string;
  summary: string;
  pdfUrl: string;
  highlights: {
    experience: string;
    skills: string;
    projects: string;
    education: string;
    certifications: string;
  };
  downloadCount: number;
  lastUpdated?: Date;
}

export interface IProfile {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  logoColor1: string;
  logoColor2: string;
  linkedinUrl: string;
  githubUrl: string;
  githubUsername: string;
  leetcodeUrl: string;
  leetcodeUsername: string;
  resumeUrl: string;
  resumeLastUpdated?: Date;
  updatedAt?: Date;
}

export interface GitHubStats {
  username: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  publicRepos: number;
  followers: number;
  following: number;
  topRepos: Array<{
    name: string;
    description: string;
    language: string;
    stars: number;
    forks?: number;
    url?: string;
  }>;
  languages: Record<string, number>;
}

export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  totalQuestions: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface IEducation {
  _id?: string;
  institution: string;
  degree: string;
  location?: string;
  period: string;
  grade?: string;
  coursework?: string[];
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
