import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  templateId?: string;

  content: {
    personalInfo: {
      name: string;
      email: string;
      phone?: string;
      linkedin?: string;
      location?: string;
      portfolio?: string;
    };
    summary?: string;
    education: Array<{
      school: string;
      degree: string;
      field?: string;
      year: string;
      gpa?: string;
    }>;
    skills: string[];
    experience: Array<{
      company: string;
      role: string;
      duration: string;
      bullets: string[];
    }>;
    projects: Array<{
      title: string;
      description: string;
      techStack: string[];
      link?: string;
      bullets: string[];
    }>;
  };
  lastAiProcessedHash: string;
  rawText?: string; 
  atsScore?: number;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema<IResume>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
    },
    templateId: {
      type: String,
      enum: ["modern", "professional", "minimalist", "executive", "creative"],
      default: "modern",
    },
    content: {
      type: Object,
      required: true,
      default: {},
    },
    lastAiProcessedHash: {
      type: String,
      default: null,
    },
    rawText: { type: String },
    atsScore: { type: Number, min: 0, max: 100 },
    pdfUrl: { type: String },
  },
  {
    timestamps: true,
  },
);

ResumeSchema.index({ title: "text" });

export default (mongoose.models.Resume as Model<IResume>) ||
  mongoose.model<IResume>("Resume", ResumeSchema);
