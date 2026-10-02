import mongoose, { Schema, Document } from 'mongoose';

export interface IEducationDoc extends Document {
  institution: string;
  degree: string;
  location?: string;
  period: string;
  grade?: string;
  coursework?: string[];
  order: number;
}

const EducationSchema = new Schema<IEducationDoc>(
  {
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree name is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    period: {
      type: String,
      required: [true, 'Period is required'],
      trim: true,
    },
    grade: {
      type: String,
      trim: true,
      default: '',
    },
    coursework: {
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

const Education =
  (mongoose.models.Education as mongoose.Model<IEducationDoc>) ||
  mongoose.model<IEducationDoc>('Education', EducationSchema);

export default Education;
