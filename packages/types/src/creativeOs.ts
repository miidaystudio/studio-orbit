export type ModeSwitcherState = 'mutations' | 'motion' | 'handoff';

export interface VisualMutation {
  selector: string;
  originalText?: string;
  newText?: string;
  originalBackground?: string;
  newBackground?: string;
  originalPadding?: string;
  newPadding?: string;
  appliedAt: string;
}

export interface VisualVariantItem {
  id: string;
  projectId: string;
  name: string;
  isActive: boolean;
  mutations: VisualMutation[];
  createdAt: string;
}

export type BezierPoints = [number, number, number, number];

export interface MotionPresetItem {
  id: string;
  projectId: string;
  selector: string;
  curveName: string;
  bezierPoints: BezierPoints;
  durationMs: number;
  delayMs: number;
  createdAt: string;
}

export interface ExtractedSvgAsset {
  id: string;
  name: string;
  svgContent: string;
  width?: string;
  height?: string;
  viewBox?: string;
}

export interface ExtractedColorToken {
  hex: string;
  name: string;
  count: number;
}

export interface EnvChecklistItem {
  key: string;
  label: string;
  isConfigured: boolean;
  requiredFor: 'AUTH' | 'DATABASE' | 'PAYMENTS' | 'EMAILS' | 'CORE';
}

export interface SignOffDetails {
  signerName: string;
  signerEmail?: string;
  timestamp: string;
  auditScore: number;
  ipAddress?: string;
}

export interface HandoffVaultItem {
  id: string;
  projectId: string;
  extractedAssets: ExtractedSvgAsset[];
  detectedColors: ExtractedColorToken[];
  envChecklist: EnvChecklistItem[];
  isSignedOff: boolean;
  signOffDetails?: SignOffDetails | null;
  updatedAt: string;
}
