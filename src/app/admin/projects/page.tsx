'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Star,
  FolderKanban,
} from 'lucide-react';
import { Github } from '@/components/shared/brand-icons';
import type { IProject } from '@/types';

const PROJECT_CATEGORIES = ['AI', 'FullStack', 'WebApp', 'Backend', 'Automation', 'Resume'] as const;

const emptyProject: Partial<IProject> = {
  title: '',
  slug: '',
  description: '',
  techStack: [],
  features: [],
  githubUrl: '',
  liveUrl: '',
  category: 'FullStack',
  featured: false,
};

export default function AdminProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IProject>>(emptyProject);
  const [techStackInput, setTechStackInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchProjects();
  }, [session, fetchProjects]);

  const resetForm = () => {
    setFormData(emptyProject);
    setTechStackInput('');
    setFeaturesInput('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (project: IProject) => {
    setFormData(project);
    setTechStackInput(project.techStack.join(', '));
    setFeaturesInput(project.features.join('\n'));
    setEditingId(project._id || null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      techStack: techStackInput.split(',').map((s) => s.trim()).filter(Boolean),
      features: featuresInput.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    try {
      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingId ? 'Project updated!' : 'Project created!');
        resetForm();
        fetchProjects();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save project');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Project deleted!');
        fetchProjects();
      } else {
        toast.error('Failed to delete project');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
            Projects
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="anime-btn flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="anime-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
              {editingId ? 'Edit Project' : 'New Project'}
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
                <label className="block text-sm font-medium text-foreground">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="anime-input"
                  placeholder="Project title"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Slug</label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="anime-input"
                  placeholder="project-slug"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="anime-input resize-none"
                placeholder="Brief project description"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Tech Stack <span className="text-muted-foreground font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                className="anime-input"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Features <span className="text-muted-foreground font-normal">(one per line)</span>
              </label>
              <textarea
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                rows={4}
                className="anime-input resize-none font-[family-name:var(--font-mono)]"
                placeholder={"Feature one\nFeature two\nFeature three"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="anime-input"
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Live URL</label>
                <input
                  type="url"
                  value={formData.liveUrl || ''}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="anime-input"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Category</label>
                <select
                  value={formData.category || 'FullStack'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as IProject['category'] })}
                  className="anime-input cursor-pointer"
                >
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-7">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
                />
                <label htmlFor="featured" className="text-sm font-medium text-foreground cursor-pointer">
                  Featured Project
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="anime-btn disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="anime-btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="anime-card rounded-2xl p-5 animate-pulse"
            >
              <div className="h-5 bg-muted rounded w-3/4 mb-3" />
              <div className="h-4 bg-muted rounded w-1/2 mb-4" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="anime-card rounded-2xl p-12 text-center">
          <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No projects yet. Add your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="anime-card rounded-2xl p-5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold font-[family-name:var(--font-heading)] text-foreground truncate">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                    )}
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                    {project.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-muted-foreground hover:text-foreground transition cursor-pointer"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-muted-foreground hover:text-foreground transition cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1.5 text-muted-foreground hover:text-primary transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => project._id && handleDelete(project._id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs bg-muted rounded-md text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 5 && (
                  <span className="px-2 py-0.5 text-xs bg-muted rounded-md text-muted-foreground">
                    +{project.techStack.length - 5}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
