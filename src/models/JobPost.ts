import mongoose, { Schema, Document } from 'mongoose';

export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Internship',
  'Remote',
  'Hybrid',
] as const;

export const JOB_STATUSES = [
  'Applied',
  'Interviewing',
  'Selected',
  'Rejected',
  'Saved',
  'Interested',
] as const;

export type JobType = (typeof JOB_TYPES)[number];
export type JobStatus = (typeof JOB_STATUSES)[number];

export interface IJobPostDoc extends Document {
  company: string;
  role: string;
  type: JobType;
  location: string;
  description: string;
  applicationUrl?: string;
  status: JobStatus;
  isPublic: boolean;
  appliedDate?: Date;
}

const JobPostSchema = new Schema<IJobPostDoc>(
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
      enum: JOB_TYPES,
      required: [true, 'Job type is required'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    applicationUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: JOB_STATUSES,
      default: 'Saved',
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    appliedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for dashboard queries
JobPostSchema.index({ status: 1, appliedDate: -1 });
JobPostSchema.index({ isPublic: 1, status: 1 });

const JobPost =
  (mongoose.models.JobPost as mongoose.Model<IJobPostDoc>) ||
  mongoose.model<IJobPostDoc>('JobPost', JobPostSchema);

export default JobPost;
