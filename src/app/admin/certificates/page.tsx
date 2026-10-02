'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Award,
  ExternalLink,
} from 'lucide-react';
import type { ICertificate } from '@/types';

const emptyCertificate: Partial<ICertificate> = {
  title: '',
  organization: '',
  issueDate: '',
  credentialUrl: '',
  description: '',
  order: 1,
};

export default function AdminCertificatesPage() {
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ICertificate>>(emptyCertificate);
  const [saving, setSaving] = useState(false);

  const fetchCertificates = useCallback(async () => {
    try {
      const res = await fetch('/api/certificates');
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchCertificates();
  }, [session, fetchCertificates]);

  const resetForm = () => {
    setFormData(emptyCertificate);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cert: ICertificate) => {
    // Format date to YYYY-MM-DD for the date input field
    const formattedDate = cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '';
    setFormData({
      ...cert,
      issueDate: formattedDate,
    });
    setEditingId(cert._id || null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId ? `/api/certificates/${editingId}` : '/api/certificates';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingId ? 'Certificate updated!' : 'Certificate created!');
        resetForm();
        fetchCertificates();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save certificate');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Certificate deleted!');
        fetchCertificates();
      } else {
        toast.error('Failed to delete certificate');
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
            Certificates
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your professional certifications
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
          Add Certificate
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="anime-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
              {editingId ? 'Edit Certificate' : 'New Certificate'}
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
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. Google Cloud GenAI"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Organization</label>
                <input
                  type="text"
                  value={formData.organization || ''}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. Google Cloud"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Issue Date</label>
                <input
                  type="date"
                  value={formData.issueDate || ''}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
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
                  placeholder="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Credential URL</label>
              <input
                type="url"
                value={formData.credentialUrl || ''}
                onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Description (Optional)</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
                placeholder="Brief summary of the certification criteria or context"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Certificate' : 'Create Certificate'}
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

      {/* Certificates List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
      ) : certificates.length === 0 ? (
        <div className="anime-card rounded-2xl p-12 text-center">
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No certificates yet. Add your first certification!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="anime-card rounded-2xl p-5 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold font-[family-name:var(--font-heading)] text-foreground line-clamp-1">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {cert.organization}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-muted-foreground hover:text-foreground transition cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleEdit(cert)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => cert._id && handleDelete(cert._id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {cert.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {cert.description}
                  </p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                  }) : ''}
                </span>
                <span className="bg-muted px-2 py-0.5 rounded">
                  Order: {cert.order}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
