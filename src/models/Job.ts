import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJob extends Document {
  externalJobId?: string;
  title: string;
  company: string;
  location?: string;
  description: string;
  extractedSkills: string[];
  experienceLevel?: string;
  salaryRange?: string;
  applyLink?: string;
  source: string;
  postedDate?: Date;
}

const JobSchema: Schema = new Schema<IJob>(
  {
    externalJobId: String,
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    description: { type: String, required: true },
    extractedSkills: [String],
    experienceLevel: String,
    salaryRange: String,
    applyLink: String,
    source: { type: String, required: true },
    postedDate: Date,
  },
  { timestamps: true },
);

JobSchema.index({ title: "text", company: "text", description: "text" });

export default (mongoose.models.Job as Model<IJob>) ||
  mongoose.model<IJob>("Job", JobSchema);
