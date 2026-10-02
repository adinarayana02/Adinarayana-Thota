'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FolderKanban,
  Award,
  Briefcase,
  Zap,
  BookOpen,
  MessageSquare,
  Mail,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';

interface DashboardStats {
  projects: number;
  certificates: number;
  experiences: number;
  skills: number;
  blogs: number;
  messages: number;
  unreadMessages: number;
  jobs: number;
}

const statsConfig = [
  {
    key: 'projects' as const,
    label: 'Projects',
    icon: FolderKanban,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    href: '/admin/projects',
  },
  {
    key: 'certificates' as const,
    label: 'Certificates',
    icon: Award,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    href: '/admin/certificates',
  },
  {
    key: 'experiences' as const,
    label: 'Experiences',
    icon: Briefcase,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    href: '/admin/experience',
  },
  {
    key: 'skills' as const,
    label: 'Skills',
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    href: '/admin/skills',
  },
  {
    key: 'blogs' as const,
    label: 'Blog Posts',
    icon: BookOpen,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    href: '/admin/blog',
  },
  {
    key: 'messages' as const,
    label: 'Messages',
    icon: MessageSquare,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    href: '/admin/messages',
  },
  {
    key: 'jobs' as const,
    label: 'Jobs',
    icon: Briefcase,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    href: '/admin/jobs',
  },
];

const quickActions = [
  { label: 'Add Project', href: '/admin/projects', icon: Plus },
  { label: 'Add Certificate', href: '/admin/certificates', icon: Plus },
  { label: 'View Messages', href: '/admin/messages', icon: Mail },
  { label: 'Edit Profile', href: '/admin/settings', icon: TrendingUp },
];

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    fetchStats();
  }, [session]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of your portfolio content
        </p>
      </div>

      {/* Unread Messages Banner */}
      {stats && stats.unreadMessages > 0 && (
        <Link
          href="/admin/messages"
          className="flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/15 transition cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            You have{' '}
            <span className="text-primary font-bold">
              {stats.unreadMessages}
            </span>{' '}
            unread message{stats.unreadMessages !== 1 ? 's' : ''}
          </span>
          <ArrowRight className="w-4 h-4 text-primary ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statsConfig.map((item) => {
          const Icon = item.icon;
          const count = loading
            ? '-'
            : stats
            ? stats[item.key]
            : 0;
          return (
            <Link
              key={item.key}
              href={item.href}
              className="anime-card rounded-2xl p-5 cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                  {loading ? (
                    <span className="inline-block w-8 h-7 bg-muted rounded animate-pulse" />
                  ) : (
                    count
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {item.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 px-4 py-3 anime-card rounded-xl hover:bg-muted/50 transition cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {action.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
