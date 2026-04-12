import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResumeVersion extends Document {
  resumeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  versionNumber: number;
  type: "original" | "ai_improved" | "manual";
  content: object;
  aiPromptUsed?: string;
  changesSummary?: string;
  createdAt: Date;
}

const ResumeVersionSchema: Schema = new Schema<IResumeVersion>(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    versionNumber: { type: Number, required: true },
    type: {
      type: String,
      enum: ["original", "ai_improved", "manual"],
      required: true,
    },
    content: { type: Object, required: true },
    aiPromptUsed: String,
    changesSummary: String,
  },
  { timestamps: true },
);

ResumeVersionSchema.index({ resumeId: 1, versionNumber: -1 });

export default (mongoose.models.ResumeVersion as Model<IResumeVersion>) ||
  mongoose.model<IResumeVersion>("ResumeVersion", ResumeVersionSchema);
