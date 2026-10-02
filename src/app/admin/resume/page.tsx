'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { 
  FileText, 
  Save, 
  Download, 
  Award, 
  GraduationCap, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Calendar, 
  MapPin 
} from 'lucide-react';
import type { IEducation } from '@/types';

interface IResumeHighlights {
  experience: string;
  skills: string;
  projects: string;
  education: string;
  certifications: string;
}

interface IResumeData {
  summary: string;
  pdfUrl: string;
  highlights: IResumeHighlights;
  downloadCount: number;
}

const emptyEducation: Partial<IEducation> = {
  institution: '',
  degree: '',
  location: '',
  period: '',
  grade: '',
  coursework: [],
  order: 1,
};

export default function AdminResumePage() {
  const { data: session } = useSession();
  
  // Resume state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState<Partial<IResumeData>>({
    summary: '',
    pdfUrl: 'https://drive.google.com/file/d/1FTtZLLZYsGK8boAFuCLHdMmciIIOjFLz/view?usp=sharing',
    highlights: {
      experience: '',
      skills: '',
      projects: '',
      education: '',
      certifications: '',
    },
    downloadCount: 0,
  });

  // Education state
  const [educations, setEducations] = useState<IEducation[]>([]);
  const [eduLoading, setEduLoading] = useState(true);
  const [showEduForm, setShowEduForm] = useState(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduFormData, setEduFormData] = useState<Partial<IEducation>>(emptyEducation);
  const [courseworkInput, setCourseworkInput] = useState('');
  const [eduSaving, setEduSaving] = useState(false);

  const fetchResume = useCallback(async () => {
    try {
      const res = await fetch('/api/resume');
      if (res.ok) {
        const data = await res.json();
        setResume(data);
      }
    } catch (error) {
      console.error('Failed to fetch resume settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEducations = useCallback(async () => {
    try {
      const res = await fetch('/api/education');
      if (res.ok) {
        const data = await res.json();
        setEducations(data);
      }
    } catch (error) {
      console.error('Failed to fetch educations:', error);
    } finally {
      setEduLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchResume();
      fetchEducations();
    }
  }, [session, fetchResume, fetchEducations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      if (res.ok) {
        const data = await res.json();
        setResume(data);
        toast.success('Resume metadata updated successfully!');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update resume details');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  // Education CRUD Handlers
  const resetEduForm = () => {
    setEduFormData(emptyEducation);
    setCourseworkInput('');
    setEditingEduId(null);
    setShowEduForm(false);
  };

  const handleEduEdit = (edu: IEducation) => {
    setEduFormData(edu);
    setCourseworkInput(edu.coursework ? edu.coursework.join(', ') : '');
    setEditingEduId(edu._id || null);
    setShowEduForm(true);
  };

  const handleEduSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEduSaving(true);

    const payload = {
      ...eduFormData,
      coursework: courseworkInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = editingEduId ? `/api/education/${editingEduId}` : '/api/education';
      const method = editingEduId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingEduId ? 'Education updated!' : 'Education created!');
        resetEduForm();
        fetchEducations();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save education record');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setEduSaving(false);
    }
  };

  const handleEduDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;

    try {
      const res = await fetch(`/api/education/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Education record deleted!');
        fetchEducations();
      } else {
        toast.error('Failed to delete education record');
      }
    } catch {
      toast.error('Something went wrong');
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
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            Resume & Education Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Review resume download metrics, section highlights, and manage education timeline records
          </p>
        </div>

        {/* Stats card */}
        <div className="anime-card p-4 rounded-xl flex items-center gap-3.5 border border-border/80 min-w-[180px]">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {resume.downloadCount || 0}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Total Downloads
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Settings */}
        <div className="anime-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] flex items-center gap-2 text-foreground pb-2 border-b border-border/50">
            <FileText className="w-5 h-5 text-primary" />
            Resume Document Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-foreground">Resume PDF URL / Path</label>
              <input
                type="text"
                value={resume.pdfUrl || ''}
                onChange={(e) => setResume({ ...resume, pdfUrl: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. /resume/Resume_Adinarayana_Thota.pdf"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Professional Summary</label>
            <textarea
              value={resume.summary || ''}
              onChange={(e) => setResume({ ...resume, summary: e.target.value })}
              rows={4}
              required
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none leading-relaxed"
              placeholder="Brief summary matching your resume..."
            />
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="anime-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] flex items-center gap-2 text-foreground pb-2 border-b border-border/50">
            <Award className="w-5 h-5 text-primary" />
            Resume Section Highlights
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Write short, bullet-point summaries or key takeaways for each resume section to display on the resume highlights page.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Experience Highlights</label>
              <input
                type="text"
                value={resume.highlights?.experience || ''}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    highlights: { ...resume.highlights!, experience: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. Developer at TELIC INFO SERVICES PRIVATE LIMITED"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Skills Highlights</label>
              <input
                type="text"
                value={resume.highlights?.skills || ''}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    highlights: { ...resume.highlights!, skills: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. Python, React.js, Node.js, TensorFlow, LangChain"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Projects Highlights</label>
              <input
                type="text"
                value={resume.highlights?.projects || ''}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    highlights: { ...resume.highlights!, projects: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. AI-powered StudyMate assistant & AlphaCare Voice AI chatbot"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Education Highlights</label>
              <input
                type="text"
                value={resume.highlights?.education || ''}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    highlights: { ...resume.highlights!, education: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. B.Tech in CSE at Gautam Buddha University (2022-2026)"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Certifications Highlights</label>
              <input
                type="text"
                value={resume.highlights?.certifications || ''}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    highlights: { ...resume.highlights!, certifications: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. Google Cloud GenAI, AWS Cloud, Walmart SWE, Postman API"
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
            {saving ? 'Saving Highlights...' : 'Save Highlights'}
          </button>
        </div>
      </form>

      {/* ── Education CRUD Manager Panel ── */}
      <div className="anime-card rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] flex items-center gap-2 text-foreground">
            <GraduationCap className="w-5 h-5 text-primary" />
            Education Details
          </h2>
          {!showEduForm && (
            <button
              onClick={() => {
                resetEduForm();
                setShowEduForm(true);
              }}
              className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add School
            </button>
          )}
        </div>

        {/* Form Modal/Section */}
        {showEduForm && (
          <form onSubmit={handleEduSubmit} className="bg-muted/40 border border-border/60 p-5 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {editingEduId ? 'Edit Education Record' : 'Add Education Record'}
              </h3>
              <button
                type="button"
                onClick={resetEduForm}
                className="w-7 h-7 rounded-lg hover:bg-muted text-muted-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-muted-foreground">Institution Name</label>
                <input
                  type="text"
                  required
                  value={eduFormData.institution || ''}
                  onChange={(e) => setEduFormData({ ...eduFormData, institution: e.target.value })}
                  className="w-full px-3.5 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs text-foreground"
                  placeholder="e.g. St. Aerjay Public School"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-muted-foreground">Degree / Standard</label>
                <input
                  type="text"
                  required
                  value={eduFormData.degree || ''}
                  onChange={(e) => setEduFormData({ ...eduFormData, degree: e.target.value })}
                  className="w-full px-3.5 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs text-foreground"
                  placeholder="e.g. 12th, Science"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-muted-foreground">Period / Timeline</label>
                <input
                  type="text"
                  required
                  value={eduFormData.period || ''}
                  onChange={(e) => setEduFormData({ ...eduFormData, period: e.target.value })}
                  className="w-full px-3.5 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs text-foreground"
                  placeholder="e.g. Mar 2020 - Jun 2022"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-muted-foreground">Grade / Score (Optional)</label>
                <input
                  type="text"
                  value={eduFormData.grade || ''}
                  onChange={(e) => setEduFormData({ ...eduFormData, grade: e.target.value })}
                  className="w-full px-3.5 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs text-foreground"
                  placeholder="e.g. 87% or 8.5 CGPA"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-muted-foreground">Location (Optional)</label>
                <input
                  type="text"
                  value={eduFormData.location || ''}
                  onChange={(e) => setEduFormData({ ...eduFormData, location: e.target.value })}
                  className="w-full px-3.5 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs text-foreground"
                  placeholder="e.g. Greater Noida, UP"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-muted-foreground">Display Order (Ascending)</label>
                <input
                  type="number"
                  value={eduFormData.order || 1}
                  onChange={(e) => setEduFormData({ ...eduFormData, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs text-foreground"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground">Coursework / Key Subjects (Comma-separated)</label>
                <input
                  type="text"
                  value={courseworkInput}
                  onChange={(e) => setCourseworkInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs text-foreground"
                  placeholder="e.g. Physics, Chemistry, Mathematics"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetEduForm}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={eduSaving}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
              >
                {eduSaving ? 'Saving...' : 'Save Record'}
              </button>
            </div>
          </form>
        )}

        {/* Education items list */}
        {eduLoading ? (
          <div className="text-center py-6 text-xs text-muted-foreground">Loading education history...</div>
        ) : educations.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground bg-muted/20 border border-dashed border-border rounded-2xl">
            No education history records found. Click "Add School" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {educations.map((edu) => (
              <div 
                key={edu._id} 
                className="p-4 bg-muted/20 border border-border/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground font-[family-name:var(--font-heading)]">
                      {edu.institution}
                    </h3>
                    {edu.grade && (
                      <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-mono font-semibold">
                        Grade: {edu.grade}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{edu.degree}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-primary" />
                      {edu.period}
                    </span>
                    {edu.location && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        {edu.location}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      Order: {edu.order}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 justify-end shrink-0">
                  <button
                    onClick={() => handleEduEdit(edu)}
                    className="p-2 hover:bg-muted text-foreground rounded-lg transition cursor-pointer"
                    title="Edit record"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => edu._id && handleEduDelete(edu._id)}
                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
