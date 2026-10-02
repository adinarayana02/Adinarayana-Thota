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
  ExternalLink,
  Lock,
  Globe,
} from 'lucide-react';

interface IJobPost {
  _id?: string;
  company: string;
  role: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Remote' | 'Hybrid';
  location: string;
  description: string;
  applicationUrl?: string;
  status: 'Applied' | 'Interviewing' | 'Selected' | 'Rejected' | 'Saved' | 'Interested';
  isPublic: boolean;
  appliedDate?: string;
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Remote', 'Hybrid'] as const;
const JOB_STATUSES = ['Applied', 'Interviewing', 'Selected', 'Rejected', 'Saved', 'Interested'] as const;

const emptyJob: Partial<IJobPost> = {
  company: '',
  role: '',
  type: 'Internship',
  location: '',
  description: '',
  applicationUrl: '',
  status: 'Saved',
  isPublic: false,
  appliedDate: '',
};

export default function AdminJobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<IJobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IJobPost>>(emptyJob);
  const [saving, setSaving] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchJobs();
  }, [session, fetchJobs]);

  const resetForm = () => {
    setFormData(emptyJob);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (job: IJobPost) => {
    const formattedDate = job.appliedDate ? new Date(job.appliedDate).toISOString().split('T')[0] : '';
    setFormData({
      ...job,
      appliedDate: formattedDate,
    });
    setEditingId(job._id || null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId ? `/api/jobs/${editingId}` : '/api/jobs';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingId ? 'Job updated!' : 'Job created!');
        resetForm();
        fetchJobs();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save job');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) return;

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Job application deleted!');
        fetchJobs();
      } else {
        toast.error('Failed to delete job application');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  if (!session) return null;

  const getStatusColor = (status: IJobPost['status']) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Interviewing':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Applied':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Saved':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Interested':
        return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-primary" />
            Job Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your career applications and leads
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
          Add Job Application
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="anime-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
              {editingId ? 'Edit Application' : 'New Application'}
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
                  placeholder="e.g. Google"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Role / Position</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. Software Engineer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Job Type</label>
                <select
                  value={formData.type || 'Internship'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as IJobPost['type'] })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
                >
                  {JOB_TYPES.map((type) => (
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
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. Mountain View, CA"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Status</label>
                <select
                  value={formData.status || 'Saved'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as IJobPost['status'] })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
                >
                  {JOB_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Applied Date</label>
                <input
                  type="date"
                  value={formData.appliedDate || ''}
                  onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-foreground">Application URL</label>
                <input
                  type="url"
                  value={formData.applicationUrl || ''}
                  onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground flex items-center gap-2">
                Description / Notes
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none text-sm"
                placeholder="Details about the job, requirements, interview preparation notes..."
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic || false}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
              />
              <label htmlFor="isPublic" className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-1.5">
                Public Application Status <span className="text-xs text-muted-foreground">(show on your public page)</span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Application' : 'Create Application'}
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

      {/* Jobs List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="anime-card rounded-2xl p-5 animate-pulse h-32"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="anime-card rounded-2xl p-12 text-center border border-dashed border-border/60">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No job applications tracked yet. Start adding your applications!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="anime-card rounded-2xl p-5 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold font-[family-name:var(--font-heading)] text-foreground text-base">
                      {job.role}
                    </h3>
                    <p className="text-sm text-primary font-medium mt-0.5">
                      {job.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition shrink-0">
                    {job.applicationUrl && (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-muted-foreground hover:text-foreground transition cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => job._id && handleDelete(job._id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 text-xs rounded-full border font-semibold ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-md font-medium">
                    {job.type}
                  </span>
                  {job.isPublic ? (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground" title="Visible on site">
                      <Globe className="w-3.5 h-3.5 text-emerald-500" />
                      Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground" title="Private to admin panel">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      Private
                    </span>
                  )}
                </div>

                {job.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                )}
                {job.appliedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Applied: {new Date(job.appliedDate).toLocaleDateString()}
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
