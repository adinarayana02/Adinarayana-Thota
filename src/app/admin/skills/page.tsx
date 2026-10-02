'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Zap,
  Star,
} from 'lucide-react';
import type { ISkill } from '@/types';

const SKILL_CATEGORIES = [
  'Programming Languages',
  'Frontend',
  'Backend',
  'Database & Cloud',
  'AI/ML & Frameworks',
  'Tools & Platforms',
] as const;

const emptySkill: Partial<ISkill> = {
  name: '',
  category: 'Programming Languages',
  icon: 'code-2',
  proficiency: 80,
  order: 1,
};

export default function AdminSkillsPage() {
  const { data: session } = useSession();
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ISkill>>(emptySkill);
  const [saving, setSaving] = useState(false);

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      toast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchSkills();
  }, [session, fetchSkills]);

  const resetForm = () => {
    setFormData(emptySkill);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (skill: ISkill) => {
    setFormData(skill);
    setEditingId(skill._id || null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId ? `/api/skills/${editingId}` : '/api/skills';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingId ? 'Skill updated!' : 'Skill created!');
        resetForm();
        fetchSkills();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save skill');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Skill deleted!');
        fetchSkills();
      } else {
        toast.error('Failed to delete skill');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  if (!session) return null;

  // Group skills by category for organized display
  const groupedSkills = SKILL_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, ISkill[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
            Skills
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your technical skills and proficiencies
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
          Add Skill
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="anime-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
              {editingId ? 'Edit Skill' : 'New Skill'}
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
                <label className="block text-sm font-medium text-foreground">Skill Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. React.js, Python"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Category</label>
                <select
                  value={formData.category || 'Programming Languages'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
                >
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Proficiency (1-100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.proficiency || 80}
                  onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) || 80 })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Icon Name</label>
                <input
                  type="text"
                  value={formData.icon || 'code-2'}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. terminal, atom, server"
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

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Skill' : 'Create Skill'}
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

      {/* Skills Grouped Grid */}
      {loading ? (
        <div className="space-y-8">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="space-y-3">
              <div className="h-6 bg-muted rounded w-48 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="anime-card rounded-xl p-4 h-16 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="anime-card rounded-2xl p-12 text-center">
          <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No skills yet. Add your first skill!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {SKILL_CATEGORIES.map((category) => {
            const catSkills = groupedSkills[category];
            if (catSkills.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-foreground border-l-3 border-primary pl-2.5">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {catSkills
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((skill) => (
                      <div
                        key={skill._id}
                        className="anime-card rounded-xl p-4 flex items-center justify-between group"
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-medium text-foreground truncate text-sm">
                              {skill.name}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0 font-medium">
                              {skill.proficiency}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="p-1 text-muted-foreground hover:text-primary transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => skill._id && handleDelete(skill._id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
