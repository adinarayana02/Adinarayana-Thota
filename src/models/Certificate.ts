import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificateDoc extends Document {
  title: string;
  organization: string;
  issueDate?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
  order: number;
}

const CertificateSchema = new Schema<ICertificateDoc>(
  {
    title: {
      type: String,
      required: [true, 'Certificate title is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Organization is required'],
      trim: true,
      index: true,
    },
    issueDate: {
      type: String,
      default: '',
    },
    credentialUrl: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
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

const Certificate =
  (mongoose.models.Certificate as mongoose.Model<ICertificateDoc>) ||
  mongoose.model<ICertificateDoc>('Certificate', CertificateSchema);

export default Certificate;
