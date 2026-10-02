'use client';

import { useSession, signOut, SessionProvider } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Briefcase,
  Zap,
  BookOpen,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Certificates', href: '/admin/certificates', icon: Award },
  { name: 'Experience', href: '/admin/experience', icon: Briefcase },
  { name: 'Skills', href: '/admin/skills', icon: Zap },
  { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Resume', href: '/admin/resume', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, router, pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background -mt-16 relative z-30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <Link
            href="/admin"
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold font-[family-name:var(--font-heading)] gradient-text text-lg">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${active ? 'text-primary' : ''}`} />
                <span className="flex-1">{link.name}</span>
                {active && (
                  <ChevronRight className="w-4 h-4 text-primary opacity-70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-border flex-shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 glass border-b border-border px-4 lg:px-8 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">
                  Welcome back,
                </h2>
                <p className="text-foreground font-semibold font-[family-name:var(--font-heading)]">
                  {session.user?.name || 'Admin'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition cursor-pointer hidden sm:block"
              >
                View Site
              </Link>
              <ThemeToggle />
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="px-3 py-1.5 text-sm bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition cursor-pointer hidden sm:flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}
