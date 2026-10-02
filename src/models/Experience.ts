import mongoose, { Schema, Document } from 'mongoose';

export const EXPERIENCE_TYPES = [
  'Full-time',
  'Part-time',
  'Internship',
  'Contract',
] as const;

export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];

export interface IExperienceDoc extends Document {
  company: string;
  role: string;
  type: ExperienceType;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  technologies: string[];
  order: number;
}

const ExperienceSchema = new Schema<IExperienceDoc>(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: EXPERIENCE_TYPES,
      required: [true, 'Employment type is required'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String,
      default: '',
    },
    current: {
      type: Boolean,
      default: false,
      index: true,
    },
    bullets: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for timeline queries
ExperienceSchema.index({ current: -1, order: 1 });

const Experience =
  (mongoose.models.Experience as mongoose.Model<IExperienceDoc>) ||
  mongoose.model<IExperienceDoc>('Experience', ExperienceSchema);

export default Experience;
