export interface ToolCommand {
  label: string;
  code: string;
}

export interface ToolEnrichment {
  overview?: string[];
  useCases?: string[];
  commands?: ToolCommand[];
  features?: string[];
  defense?: string[];
  related?: string[];
}

export type ToolContentTier = "rich" | "enhanced" | "baseline";
