import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillDoc extends Document {
  name: string;
  category: string;
  icon?: string;
  proficiency: number;
  order: number;
}

const SkillSchema = new Schema<ISkillDoc>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    icon: {
      type: String,
      default: '',
    },
    proficiency: {
      type: Number,
      min: [1, 'Proficiency must be at least 1'],
      max: [100, 'Proficiency cannot exceed 100'],
      default: 50,
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

// Compound index for grouped skill listing
SkillSchema.index({ category: 1, order: 1 });
// Unique name within a category
SkillSchema.index({ name: 1, category: 1 }, { unique: true });

const Skill =
  (mongoose.models.Skill as mongoose.Model<ISkillDoc>) ||
  mongoose.model<ISkillDoc>('Skill', SkillSchema);

export default Skill;
