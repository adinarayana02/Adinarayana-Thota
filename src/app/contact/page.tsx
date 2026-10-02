"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Github, Linkedin, Instagram, Youtube, Substack } from "@/components/shared/brand-icons";
import { siteConfig } from "@/lib/constants";
import { toast } from "sonner";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
        reset();
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const socialLinks = [
    {
      name: "Instagram",
      href: siteConfig.links.instagram || "https://www.instagram.com/techtalks02/",
      icon: Instagram,
      handle: "@techtalks02 (AI Agents & Video Content)",
    },
    {
      name: "YouTube",
      href: siteConfig.links.youtube || "https://www.youtube.com/@Techtalks02-ai",
      icon: Youtube,
      handle: "@Techtalks02-ai (TechTalks02 AI)",
    },
    {
      name: "GitHub",
      href: siteConfig.links.github,
      icon: Github,
      handle: "@adinarayana02",
    },
    {
      name: "LinkedIn",
      href: siteConfig.links.linkedin,
      icon: Linkedin,
      handle: "Adinarayana Thota",
    },
    {
      name: "Substack",
      href: siteConfig.links.substack || "https://thotaadinarayana.substack.com",
      icon: Substack,
      handle: "Tech Talks 02",
    },
    {
      name: "Email",
      href: `mailto:${siteConfig.email}`,
      icon: ExternalLink,
      handle: "thotaadinarayana02@gmail.com",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-muted/30 grid-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)]">
              Hire Adinarayana <span className="gradient-text">Thota</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Open for AI / ML Developer, Generative AI, AI Agents, and Multi-Agent engineering roles. Send a project brief or job opportunity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {submitted ? (
                <div className="anime-card rounded-2xl p-10 text-center">
                  <CheckCircle2 className="w-16 h-16 mx-auto text-accent mb-4" />
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
                    Message Sent!
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="anime-btn-outline mt-6"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="anime-card rounded-2xl p-8 space-y-6"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      className="anime-input w-full"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      placeholder="your@email.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address",
                        },
                      })}
                      className="anime-input w-full"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      autoComplete="off"
                      placeholder="Freelance project, AI integration, or full-time role"
                      {...register("subject", {
                        required: "Subject is required",
                        minLength: {
                          value: 3,
                          message: "Subject must be at least 3 characters",
                        },
                      })}
                      className="anime-input w-full"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      autoComplete="off"
                      placeholder="Tell me the goal, timeline, budget/range if relevant, and what kind of help you need…"
                      {...register("message", {
                        required: "Message is required",
                        minLength: {
                          value: 10,
                          message: "Message must be at least 10 characters",
                        },
                      })}
                      className="anime-input w-full resize-none"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="anime-btn w-full flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send hiring request
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info + Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Info */}
              <div className="anime-card rounded-2xl p-8 space-y-6">
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)]">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors duration-200">
                        {siteConfig.email}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors duration-200">
                      <Phone className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium group-hover:text-secondary transition-colors duration-200">
                        {siteConfig.phone}
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">
                        {siteConfig.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="anime-card rounded-2xl p-8">
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">
                  Social Links
                </h3>
                <div className="space-y-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300 group"
                    >
                      <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{social.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {social.handle}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="anime-card rounded-2xl p-8 text-center">
                <p className="text-lg font-bold font-[family-name:var(--font-heading)]">
                  Available for{" "}
                  <span className="gradient-text-anime">freelance and hiring</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Best fit: AI products, automation workflows, RAG tools,
                  admin dashboards, and MERN/Next.js applications.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
