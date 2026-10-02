export interface IProfileData {
  name: string;
  shortName: string;
  tagline: string;
  role: string;
  specialization: string;
  location: string;
  yearsOfExperience: string;
  bio: string;
  avatarSvg: string;
  social: {
    github: string;
    linkedin: string;
    instagram: string;
    youtube?: string;
    substack?: string;
    substackProfile?: string;
    email: string;
    phone: string;
    website: string;
    resume: string;
  };
}

export interface ISkillCategoryData {
  name: string;
  items: string[];
}

export interface ISkillsData {
  categories: ISkillCategoryData[];
}

export interface IExperienceData {
  company: string;
  role: string;
  type?: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
}

export interface IProjectData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  role: string;
  year: string;
  link: string;
  githubUrl?: string;
  liveUrl?: string;
  image: string;
  highlight: boolean;
  metrics?: Record<string, string>;
  challenges?: string;
  solutions?: string;
  architectureSteps?: { title: string; description: string }[];
}

export interface IEducationData {
  institution: string;
  degree: string;
  location?: string;
  period: string;
  grade?: string;
  coursework?: string[];
}

export interface ITestimonialData {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarColor: string;
}

export interface IPortfolioData {
  profile: IProfileData;
  skills: ISkillsData;
  experience: IExperienceData[];
  projects: IProjectData[];
  education: IEducationData[];
  testimonials: ITestimonialData[];
}
