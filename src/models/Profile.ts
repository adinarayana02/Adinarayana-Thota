import mongoose, { Schema, Document } from 'mongoose';

export interface IProfileDoc extends Document {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  logoColor1: string;
  logoColor2: string;
  linkedinUrl: string;
  githubUrl: string;
  githubUsername: string;
  leetcodeUrl: string;
  leetcodeUsername: string;
  resumeUrl: string;
  resumeLastUpdated?: Date;
}

const ProfileSchema = new Schema<IProfileDoc>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    logoColor1: {
      type: String,
      default: '#6366F1', // Primary indigo
    },
    logoColor2: {
      type: String,
      default: '#22D3EE', // Secondary cyan
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: '',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    githubUsername: {
      type: String,
      trim: true,
      default: '',
    },
    leetcodeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    leetcodeUsername: {
      type: String,
      trim: true,
      default: '',
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    resumeLastUpdated: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Profile =
  (mongoose.models.Profile as mongoose.Model<IProfileDoc>) ||
  mongoose.model<IProfileDoc>('Profile', ProfileSchema);

export default Profile;
