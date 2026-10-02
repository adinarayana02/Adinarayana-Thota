import Link from "next/link";
import {
  Mail,
  ExternalLink,
  Heart,
  Code2,
} from "lucide-react";
import { Github, Linkedin, Instagram, Youtube } from "@/components/shared/brand-icons";
import { siteConfig, navLinks } from "@/lib/constants";

export function Footer() {
  const socialLinks = [
    { name: "GitHub", href: siteConfig.links.github, icon: Github },
    { name: "LinkedIn", href: siteConfig.links.linkedin, icon: Linkedin },
    { name: "Instagram", href: siteConfig.links.instagram, icon: Instagram },
    { name: "YouTube", href: siteConfig.links.youtube, icon: Youtube },
    { name: "LeetCode", href: siteConfig.links.leetcode, icon: ExternalLink },
    { name: "Email", href: `mailto:${siteConfig.email}`, icon: Mail },
  ];

  const quickLinks = navLinks.slice(0, 6);
  const moreLinks = navLinks.slice(6);

  return (
    <footer className="relative mt-auto">
      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 cursor-pointer group w-fit">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Code2 className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-[family-name:var(--font-heading)] text-lg font-bold">
                  {siteConfig.name.split(" ")[0]}
                  <span className="text-primary">.</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                {siteConfig.title}. Building intelligent systems and delightful
                web experiences.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-[family-name:var(--font-heading)] text-sm font-semibold mb-4 text-foreground">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* More */}
            <div>
              <h4 className="font-[family-name:var(--font-heading)] text-sm font-semibold mb-4 text-foreground">
                More
              </h4>
              <ul className="space-y-2">
                {moreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/resume"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  >
                    Resume
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by{" "}
              {siteConfig.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
