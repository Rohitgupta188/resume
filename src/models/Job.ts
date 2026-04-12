import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJob extends Document {
  externalJobId: string;
  searchQuery: string;
  title: string;
  company: string;
  location: string;
  description: string;
  extractedSkills: string[];
  experienceLevel?: string;
  salaryRange?: string;
  applyLink?: string;
  source: string;
  postedDate?: Date;
  expiresAt: Date;
}

const JobSchema: Schema = new Schema<IJob>(
  {
    externalJobId: { type: String, required: true},
    searchQuery: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    description: { type: String, required: true },
    extractedSkills: { type: [String], default: [] },
    experienceLevel: String,
    salaryRange: String,
    applyLink: String,
    source: { type: String, required: true },
    postedDate: Date,
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

JobSchema.index({ title: "text", company: "text", description: "text" });

JobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

JobSchema.index({ externalJobId: 1 }, { unique: true });

JobSchema.index({ searchQuery: 1, expiresAt: 1 });

export default (mongoose.models.Job as Model<IJob>) ||
  mongoose.model<IJob>("Job", JobSchema);
