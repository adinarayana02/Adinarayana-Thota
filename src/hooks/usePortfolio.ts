import { useState, useEffect } from "react";
import type { IPortfolioData } from "@/types/portfolio";
import portfolioStatic from "@/data/portfolio.json";

export function usePortfolio() {
  const [data, setData] = useState<IPortfolioData>(portfolioStatic as unknown as IPortfolioData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        // Fetch profile, experiences, projects, and education in parallel from our MongoDB APIs
        const [profileRes, expRes, projRes, eduRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/experience"),
          fetch("/api/projects"),
          fetch("/api/education"),
        ]);

        const staticData = portfolioStatic as unknown as IPortfolioData;
        let updatedData = { ...staticData };
        let hasUpdates = false;

        if (profileRes.ok) {
          const profile = await profileRes.json();
          if (profile && !profile.error) {
            updatedData.profile = {
              name: profile.name || staticData.profile.name,
              shortName: staticData.profile.shortName, // use static shortName if not in schema
              tagline: profile.title || staticData.profile.tagline,
              role: profile.title || staticData.profile.role,
              specialization: staticData.profile.specialization,
              location: profile.location || staticData.profile.location,
              yearsOfExperience: staticData.profile.yearsOfExperience,
              bio: profile.bio || staticData.profile.bio,
              avatarSvg: staticData.profile.avatarSvg,
              social: {
                github: profile.githubUrl || staticData.profile.social.github,
                linkedin: profile.linkedinUrl || staticData.profile.social.linkedin,
                instagram: profile.instagramUrl || staticData.profile.social.instagram,
                youtube: profile.youtubeUrl || staticData.profile.social.youtube,
                substack: staticData.profile.social.substack,
                substackProfile: staticData.profile.social.substackProfile,
                email: profile.email || staticData.profile.social.email,
                phone: profile.phone || staticData.profile.social.phone,
                website: staticData.profile.social.website,
                resume: profile.resumeUrl || staticData.profile.social.resume,
              },
            };
            hasUpdates = true;
          }
        }

        if (expRes.ok) {
          const experiences = await expRes.json();
          const array = Array.isArray(experiences) ? experiences : (experiences.experiences || experiences);
          if (Array.isArray(array) && array.length > 0) {
            // Sort by order
            const sorted = [...array].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            updatedData.experience = sorted.map((exp: any) => {
              const startStr = exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';
              const endStr = exp.current 
                ? 'Present' 
                : exp.endDate 
                  ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) 
                  : '';

              return {
                company: exp.company,
                role: exp.role,
                type: exp.type || "Internship",
                period: exp.period || `${startStr} - ${endStr}`,
                location: exp.location,
                summary: exp.bullets ? exp.bullets[0] || "" : "",
                highlights: exp.bullets || [],
              };
            });
            hasUpdates = true;
          }
        }

        if (projRes.ok) {
          const projects = await projRes.json();
          const array = Array.isArray(projects) ? projects : (projects.projects || projects);
          if (Array.isArray(array) && array.length > 0) {
            const sorted = [...array].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            updatedData.projects = sorted.map((p: any) => ({
              id: p.slug || p._id,
              title: p.title,
              subtitle: p.description,
              description: p.longDescription || p.description,
              stack: p.techStack || [],
              role: p.role || "Developer",
              year: p.year || "2026",
              githubUrl: p.githubUrl || "",
              liveUrl: p.liveUrl || p.link || "",
              link: p.liveUrl || p.githubUrl || "",
              image: p.image || "",
              highlight: p.featured || false,
              metrics: p.metrics,
              challenges: p.challenges,
              solutions: p.solutions,
              architectureSteps: p.architectureSteps,
            }));
            hasUpdates = true;
          }
        }

        if (eduRes.ok) {
          const educations = await eduRes.json();
          const array = Array.isArray(educations) ? educations : (educations.education || educations);
          if (Array.isArray(array) && array.length > 0) {
            const sorted = [...array].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            updatedData.education = sorted.map((edu: any) => ({
              institution: edu.institution,
              degree: edu.degree,
              location: edu.location || "",
              period: edu.period,
              grade: edu.grade || "",
              coursework: edu.coursework || [],
            }));
            hasUpdates = true;
          }
        }

        if (hasUpdates) {
          setData(updatedData);
        }
      } catch (error) {
        console.error("Failed to fetch custom portfolio data from API, using static json", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUpdates();
  }, []);

  return { data, loading };
}
