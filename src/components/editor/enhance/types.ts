export interface RubricBreakdown {
  keywordRelevance: number;    // max 30
  impactQuantification: number; // max 25
  writingQuality: number;      // max 20
  structureClarity: number;    // max 15
  projectRelevance: number;    // max 10
}

export interface EnhanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalContent: {
    atsScore?: number;
    content?: any;
    [key: string]: any;
  };
  enhancedData: {
    improvedContent: any;
    atsScore: number;
    analysis?: {
      contentHash?: string;
      suggestions?: string[];
      rubricBreakdown?: RubricBreakdown;
      [key: string]: any;
    };
    contentHash?: string;
    rubricBreakdown?: RubricBreakdown;
  } | null;
  onAccept: (data: {
    improvedContent: any;
    atsScore: number;
    contentHash: string;
  }) => void;
  onDiscard: () => void;
}

export const RUBRIC_CONFIG = [
  {
    key: "keywordRelevance" as keyof RubricBreakdown,
    label: "Keyword relevance",
    max: 30,
    color: "#6366f1", // indigo
    trackColor: "#e0e7ff",
    darkTrackColor: "#1e1b4b",
  },
  {
    key: "impactQuantification" as keyof RubricBreakdown,
    label: "Impact & metrics",
    max: 25,
    color: "#0ea5e9", // sky
    trackColor: "#e0f2fe",
    darkTrackColor: "#0c1a2e",
  },
  {
    key: "writingQuality" as keyof RubricBreakdown,
    label: "Writing quality",
    max: 20,
    color: "#10b981", // emerald
    trackColor: "#d1fae5",
    darkTrackColor: "#052e16",
  },
  {
    key: "structureClarity" as keyof RubricBreakdown,
    label: "Structure & clarity",
    max: 15,
    color: "#f59e0b", // amber
    trackColor: "#fef3c7",
    darkTrackColor: "#1c1407",
  },
  {
    key: "projectRelevance" as keyof RubricBreakdown,
    label: "Project relevance",
    max: 10,
    color: "#ec4899", // pink
    trackColor: "#fce7f3",
    darkTrackColor: "#1f0514",
  },
] as const;
