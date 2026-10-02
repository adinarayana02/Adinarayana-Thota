import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeHighlights {
  experience: string;
  skills: string;
  projects: string;
  education: string;
  certifications: string;
}

export interface IResumeDoc extends Document {
  summary: string;
  pdfUrl: string;
  highlights: IResumeHighlights;
  downloadCount: number;
  lastUpdated?: Date;
}

const ResumeSchema = new Schema<IResumeDoc>(
  {
    summary: {
      type: String,
      required: [true, 'Resume summary is required'],
    },
    pdfUrl: {
      type: String,
      required: [true, 'PDF URL is required'],
      trim: true,
    },
    highlights: {
      experience: { type: String, default: '' },
      skills: { type: String, default: '' },
      projects: { type: String, default: '' },
      education: { type: String, default: '' },
      certifications: { type: String, default: '' },
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Resume =
  (mongoose.models.Resume as mongoose.Model<IResumeDoc>) ||
  mongoose.model<IResumeDoc>('Resume', ResumeSchema);

export default Resume;
