'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Briefcase,
  Calendar,
  MapPin,
} from 'lucide-react';
import type { IExperience } from '@/types';

const EXPERIENCE_TYPES = ['Internship', 'Full-Time', 'Part-Time', 'Freelance', 'Contract'] as const;

const emptyExperience: Partial<IExperience> = {
  company: '',
  role: '',
  type: 'Internship',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  bullets: [],
  technologies: [],
  order: 1,
};

export default function AdminExperiencePage() {
  const { data: session } = useSession();
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IExperience>>(emptyExperience);
  const [bulletsInput, setBulletsInput] = useState('');
  const [technologiesInput, setTechnologiesInput] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchExperiences = useCallback(async () => {
    try {
      const res = await fetch('/api/experience');
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      toast.error('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchExperiences();
  }, [session, fetchExperiences]);

  const resetForm = () => {
    setFormData(emptyExperience);
    setBulletsInput('');
    setTechnologiesInput('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (exp: IExperience) => {
    setFormData(exp);
    setBulletsInput(exp.bullets.join('\n'));
    setTechnologiesInput(exp.technologies.join(', '));
    setEditingId(exp._id || null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      bullets: bulletsInput.split('\n').map((s) => s.trim()).filter(Boolean),
      technologies: technologiesInput.split(',').map((s) => s.trim()).filter(Boolean),
      endDate: formData.current ? 'Present' : formData.endDate,
    };

    try {
      const url = editingId ? `/api/experience/${editingId}` : '/api/experience';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingId ? 'Experience updated!' : 'Experience created!');
        resetForm();
        fetchExperiences();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save experience');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Experience deleted!');
        fetchExperiences();
      } else {
        toast.error('Failed to delete experience');
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
            Experience
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your work history and internships
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="anime-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
              {editingId ? 'Edit Experience' : 'New Experience'}
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
                <label className="block text-sm font-medium text-foreground">Company Name</label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. TELIC INFO SERVICES PRIVATE LIMITED"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Role / Title</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. Developer (AI / ML, Generative AI)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Job Type</label>
                <select
                  value={formData.type || 'Internship'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as IExperience['type'] })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
                >
                  {EXPERIENCE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. Noida, India"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Display Order</label>
                <input
                  type="number"
                  value={formData.order || 1}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Start Date</label>
                <input
                  type="text"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. June 2025"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">End Date</label>
                <input
                  type="text"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.current}
                  required={!formData.current}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground disabled:opacity-50"
                  placeholder="e.g. July 2025"
                />
              </div>
              <div className="flex items-center gap-3 pt-7">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current || false}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
                />
                <label htmlFor="current" className="text-sm font-medium text-foreground cursor-pointer">
                  Currently Work Here
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Technologies Used <span className="text-muted-foreground font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={technologiesInput}
                onChange={(e) => setTechnologiesInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="Python, React, Google Gemini"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Achievements / Bullet Points <span className="text-muted-foreground font-normal">(one per line)</span>
              </label>
              <textarea
                value={bulletsInput}
                onChange={(e) => setBulletsInput(e.target.value)}
                rows={5}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none text-sm"
                placeholder="Designed and deployed a Generative AI platform..."
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Experience' : 'Create Experience'}
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

      {/* Experience List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="anime-card rounded-2xl p-6 animate-pulse"
            >
              <div className="h-6 bg-muted rounded w-1/4 mb-3" />
              <div className="h-4 bg-muted rounded w-1/3 mb-4" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="anime-card rounded-2xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No experience items yet. Add your first job/internship!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="anime-card rounded-2xl p-6 group"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-[family-name:var(--font-heading)] text-lg text-foreground flex items-center gap-2">
                      {exp.role}
                      {exp.current && (
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0" title="Current role" />
                      )}
                    </h3>
                    <div className="text-sm font-medium text-primary mt-0.5">
                      {exp.company} <span className="text-muted-foreground font-normal">({exp.type})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </span>
                      <span>Order: {exp.order}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition shrink-0 self-end md:self-start">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => exp._id && handleDelete(exp._id)}
                    className="p-2 bg-muted text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pl-0 md:pl-16 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed pl-1 -indent-5 ml-5">
                      {bullet}
                    </li>
                  ))}
                </ul>

                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs bg-muted rounded-md text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
