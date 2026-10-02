import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogDoc extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage?: string;
  tags: string[];
  source: 'article' | 'linkedin';
  externalUrl?: string;
  linkedinPostId?: string;
  published: boolean;
  publishedAt?: Date;
  readingTime?: number;
}

const BlogSchema = new Schema<IBlogDoc>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    source: {
      type: String,
      enum: ['article', 'linkedin'],
      default: 'article',
      index: true,
    },
    externalUrl: {
      type: String,
      default: '',
      trim: true,
    },
    linkedinPostId: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    readingTime: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate reading time before saving
BlogSchema.pre('save', function () {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
});

// Auto-set publishedAt when first published
BlogSchema.pre('save', function () {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

// Compound index for public blog listing
BlogSchema.index({ published: 1, publishedAt: -1 });
BlogSchema.index({ tags: 1, published: 1 });
BlogSchema.index({ source: 1, publishedAt: -1 });

const Blog =
  (mongoose.models.Blog as mongoose.Model<IBlogDoc>) ||
  mongoose.model<IBlogDoc>('Blog', BlogSchema);

export default Blog;
