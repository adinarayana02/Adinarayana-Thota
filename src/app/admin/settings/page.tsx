'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Settings, Save, Palette, User, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

interface IProfileData {
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
}

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<IProfileData>>({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    logoColor1: '#6366f1',
    logoColor2: '#22d3ee',
    linkedinUrl: '',
    githubUrl: '',
    githubUsername: '',
    leetcodeUrl: '',
    leetcodeUsername: '',
    resumeUrl: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch profile settings:', error);
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchProfile();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        toast.success('Profile settings updated successfully!');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update profile');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (!session) return null;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="anime-card rounded-2xl p-6 h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground flex items-center gap-2">
          <Settings className="w-7 h-7 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure your personal info, branding colors, and portfolio integrations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="anime-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] flex items-center gap-2 text-foreground pb-2 border-b border-border/50">
            <User className="w-5 h-5 text-primary" />
            Personal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Job Title</label>
              <input
                type="text"
                value={profile.title || ''}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Bio</label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              required
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Phone
              </label>
              <input
                type="text"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Location
              </label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Branding & Logo Colors */}
        <div className="anime-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] flex items-center gap-2 text-foreground pb-2 border-b border-border/50">
            <Palette className="w-5 h-5 text-primary" />
            Branding & Logo Colors
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Customize the 3D logo gradient colors used in the navbar and home hero section.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground flex items-center gap-1.5">
                Gradient Color 1 (Hex)
              </label>
              <div className="flex gap-2.5">
                <input
                  type="color"
                  value={profile.logoColor1 || '#6366f1'}
                  onChange={(e) => setProfile({ ...profile, logoColor1: e.target.value })}
                  className="w-12 h-10 bg-muted border border-border rounded-xl cursor-pointer p-1"
                />
                <input
                  type="text"
                  value={profile.logoColor1 || ''}
                  onChange={(e) => setProfile({ ...profile, logoColor1: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground uppercase font-mono"
                  placeholder="#6366f1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground flex items-center gap-1.5">
                Gradient Color 2 (Hex)
              </label>
              <div className="flex gap-2.5">
                <input
                  type="color"
                  value={profile.logoColor2 || '#22d3ee'}
                  onChange={(e) => setProfile({ ...profile, logoColor2: e.target.value })}
                  className="w-12 h-10 bg-muted border border-border rounded-xl cursor-pointer p-1"
                />
                <input
                  type="text"
                  value={profile.logoColor2 || ''}
                  onChange={(e) => setProfile({ ...profile, logoColor2: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground uppercase font-mono"
                  placeholder="#22d3ee"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Profile Integrations */}
        <div className="anime-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] flex items-center gap-2 text-foreground pb-2 border-b border-border/50">
            <LinkIcon className="w-5 h-5 text-primary" />
            Integrations & Social Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">GitHub Username</label>
              <input
                type="text"
                value={profile.githubUsername || ''}
                onChange={(e) => setProfile({ ...profile, githubUsername: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">GitHub Profile URL</label>
              <input
                type="url"
                value={profile.githubUrl || ''}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">LeetCode Username</label>
              <input
                type="text"
                value={profile.leetcodeUsername || ''}
                onChange={(e) => setProfile({ ...profile, leetcodeUsername: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">LeetCode Profile URL</label>
              <input
                type="url"
                value={profile.leetcodeUrl || ''}
                onChange={(e) => setProfile({ ...profile, leetcodeUrl: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedinUrl || ''}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Resume File URL</label>
              <input
                type="text"
                value={profile.resumeUrl || ''}
                onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="/resume/Resume_Adinarayana_Thota.pdf"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4.5 h-4.5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
