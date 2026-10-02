'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  BookOpen,
  Calendar,
  Tag,
  Globe,
  Lock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Linkedin } from '@/components/shared/brand-icons';

interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage?: string;
  tags: string[];
  source: 'article' | 'linkedin';
  externalUrl?: string;
  linkedinPostId?: string;
  published: boolean;
  publishedAt?: string;
  readingTime?: number;
}

const emptyBlog: Partial<IBlog> = {
  title: '',
  slug: '',
  description: '',
  content: '',
  coverImage: '',
  tags: [],
  source: 'article',
  externalUrl: '',
  published: false,
};

export default function AdminBlogPage() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IBlog>>(emptyBlog);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncingLinkedIn, setSyncingLinkedIn] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    const timer = window.setTimeout(() => {
      void fetchBlogs();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [session, fetchBlogs]);

  const resetForm = () => {
    setFormData(emptyBlog);
    setTagsInput('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (blog: IBlog) => {
    setFormData(blog);
    setTagsInput(blog.tags.join(', '));
    setEditingId(blog._id || null);
    setShowForm(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    const slug = generateSlug(title);
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      tags: tagsInput.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      const url = editingId ? `/api/blog/${editingId}` : '/api/blog';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingId ? 'Blog updated!' : 'Blog created!');
        resetForm();
        fetchBlogs();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save blog');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Blog deleted!');
        fetchBlogs();
      } else {
        toast.error('Failed to delete blog');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleLinkedInSync = async () => {
    setSyncingLinkedIn(true);
    try {
      const res = await fetch('/api/linkedin/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'LinkedIn posts synced');
        fetchBlogs();
      } else {
        toast.error(data.error || 'LinkedIn sync failed');
      }
    } catch {
      toast.error('Could not connect to LinkedIn sync');
    } finally {
      setSyncingLinkedIn(false);
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" />
            Blog Posts
          </h1>
          <p className="text-muted-foreground mt-1">
            Write, review, and publish articles
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={handleLinkedInSync}
            disabled={syncingLinkedIn}
            className="px-4 py-2 border border-border bg-card text-foreground rounded-xl hover:border-primary/40 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncingLinkedIn ? 'animate-spin' : ''}`} />
            {syncingLinkedIn ? 'Syncing…' : 'Sync LinkedIn'}
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="anime-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
              {editingId ? 'Edit Blog Post' : 'New Blog Post'}
            </h2>
            <button
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="blog-source" className="block text-sm font-medium text-foreground">Post Source</label>
                <select
                  id="blog-source"
                  value={formData.source || 'article'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      source: e.target.value as IBlog['source'],
                    })
                  }
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                >
                  <option value="article">Portfolio Article</option>
                  <option value="linkedin">LinkedIn Post</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="external-url" className="block text-sm font-medium text-foreground">
                  LinkedIn Post URL
                </label>
                <input
                  id="external-url"
                  type="url"
                  value={formData.externalUrl || ''}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  required={formData.source === 'linkedin'}
                  disabled={formData.source !== 'linkedin'}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground disabled:opacity-50"
                  placeholder="https://www.linkedin.com/posts/…"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. Getting Started with LangChain"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Slug</label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="getting-started-with-langchain"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.coverImage || ''}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="https://example.com/cover.jpg"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Tags <span className="text-muted-foreground font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="AI, RAG, Python"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Short Description</label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="Brief summary of the article"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Content (Markdown)</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={12}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none font-[family-name:var(--font-mono)] text-sm"
                placeholder={formData.source === 'linkedin'
                  ? 'Paste the LinkedIn post text here…'
                  : 'Write your article content here in Markdown format…'}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published || false}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
              />
              <label htmlFor="published" className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-1.5">
                Publish Post <span className="text-xs text-muted-foreground">(make it visible on the blog page)</span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving…' : editingId ? 'Update Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-muted text-foreground rounded-xl hover:opacity-80 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="anime-card rounded-2xl p-5 animate-pulse h-32"
            />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="anime-card rounded-2xl p-12 text-center border border-dashed border-border/60">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No blog posts written yet. Write your first article!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="anime-card rounded-2xl p-5 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold font-[family-name:var(--font-heading)] text-foreground text-base line-clamp-1">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      /{blog.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition shrink-0">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => blog._id && handleDelete(blog._id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {blog.source === 'linkedin' && (
                    <span className="px-2 py-0.5 text-xs bg-[#0A66C2]/10 text-[#4ea1f3] border border-[#0A66C2]/20 rounded-full font-semibold flex items-center gap-1">
                      <Linkedin className="w-3 h-3" />
                      LinkedIn
                    </span>
                  )}
                  {blog.published ? (
                    <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full font-semibold flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-full font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Draft
                    </span>
                  )}
                  {blog.readingTime && (
                    <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-md font-medium">
                      {blog.readingTime} min read
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {blog.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString()
                    : 'Not published'}
                </span>
                {blog.tags.length > 0 && (
                  <span className="flex items-center gap-1 text-primary">
                    <Tag className="w-3 h-3" />
                    {blog.tags[0]}
                  </span>
                )}
                {blog.source === 'linkedin' && blog.externalUrl && (
                  <a
                    href={blog.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#4ea1f3] hover:underline"
                  >
                    View post <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
