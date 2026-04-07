import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMatch extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  scoreBreakdown: {
    skills: number;
    experience: number;
    projects: number;
  };
  suggestions: string[];
}

const MatchSchema: Schema = new Schema<IMatch>(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    resumeId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Resume", 
      required: true 
    },
    jobId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Job", 
      required: true 
    },
    matchPercentage: { 
      type: Number, 
      min: 0, 
      max: 100, 
      required: true 
    },
    matchedSkills: [String],
    missingSkills: [String],
    scoreBreakdown: {
      skills: Number,
      experience: Number,
      projects: Number,
    },
    suggestions: [String],
  },
  { timestamps: true }
);

export default (mongoose.models.Match as Model<IMatch>) || 
       mongoose.model<IMatch>("Match", MatchSchema);