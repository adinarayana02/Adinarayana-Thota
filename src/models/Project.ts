import mongoose, { Schema, Document } from 'mongoose';

export const PROJECT_CATEGORIES = [
  'AI',
  'FullStack',
  'WebApp',
  'Backend',
  'Automation',
  'Resume',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface IProjectDoc extends Document {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  features: string[];
  githubUrl: string;
  liveUrl: string;
  image?: string;
  screenshots: string[];
  category: ProjectCategory;
  featured: boolean;
  order: number;
  metrics?: Record<string, string>;
  challenges?: string;
  solutions?: string;
  architectureSteps?: { title: string; description: string }[];
}

const ProjectSchema = new Schema<IProjectDoc>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    longDescription: {
      type: String,
      default: '',
    },
    techStack: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    screenshots: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: PROJECT_CATEGORIES,
      required: [true, 'Category is required'],
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    metrics: {
      type: Map,
      of: String,
    },
    challenges: {
      type: String,
      default: '',
    },
    solutions: {
      type: String,
      default: '',
    },
    architectureSteps: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for sorted listing queries
ProjectSchema.index({ featured: -1, order: 1 });
ProjectSchema.index({ category: 1, order: 1 });

const Project =
  (mongoose.models.Project as mongoose.Model<IProjectDoc>) ||
  mongoose.model<IProjectDoc>('Project', ProjectSchema);

export default Project;
