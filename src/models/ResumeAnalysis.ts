import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResumeAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;

  atsScore: number;

  sectionFeedback: {
    summary?: string;
    education?: string;
    experience?: string;
    projects?: string;
    skills?: string;
  };

  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];

  suggestions: string[];
  improvedContent: Object;
  contentHash: string;
  modelUsed?: string; // e.g. "gemini-pro"
  tokensUsed?: number;

  createdAt: Date;
  updatedAt: Date;
}

const ResumeAnalysisSchema: Schema = new Schema<IResumeAnalysis>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },

    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    sectionFeedback: {
      summary: { type: String },
      education: { type: String },
      experience: { type: String },
      projects: { type: String },
      skills: { type: String },
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    improvedContent: {
      type: Object,
      required: true,
    },

    contentHash: {
      type: String,
    },

    modelUsed: {
      type: String,
    },

    tokensUsed: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

// 🔥 Indexes for performance
ResumeAnalysisSchema.index({ resumeId: 1, contentHash: 1, createdAt: -1 }); // latest analysis fast

export default (mongoose.models.ResumeAnalysis as Model<IResumeAnalysis>) ||
  mongoose.model<IResumeAnalysis>("ResumeAnalysis", ResumeAnalysisSchema);
