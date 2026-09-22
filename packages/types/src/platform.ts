export interface ShowcaseStop {
  id: string;
  title: string;
  selectorPath: string;
  scrollPercentage?: number;
  hotspotX?: number;
  hotspotY?: number;
  designerNotes: string;
}

export interface SprintShowcaseData {
  id: string;
  clientId: string;
  title: string;
  versionTag: string;
  stagingUrl: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED';
  stops: ShowcaseStop[];
  approvedAt?: string;
  approvalSignature?: string;
}

export interface ColorTokens {
  background: string;
  primary: string;
  accent: string;
  surface?: string;
  text?: string;
}

export interface DesignTokenSet {
  id?: string;
  name: string;
  radius: number; // e.g. 0 to 24px
  fontFamily: 'serif' | 'sans' | 'mono';
  fontScale: number;
  colorTokens: ColorTokens;
  createdByClient?: boolean;
}

export interface MetaDetails {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogImage?: string;
  ogDescription?: string;
  twitterCard?: string;
  canonicalUrl?: string;
}

export interface AssetIssue {
  url: string;
  issueType: 'MISSING_ALT' | 'OVERWEIGHT_FILE' | 'UNCOMPRESSED_IMAGE' | 'SLOW_LOAD';
  sizeBytes?: number;
  recommendation: string;
}

export interface LaunchAuditResult {
  id: string;
  stagingUrl: string;
  score: number; // 0 to 100
  metaDetails: MetaDetails;
  assetIssues: AssetIssue[];
  missingTags: string[];
  scannedAt: string;
}

export interface BrandVaultRuleData {
  id: string;
  clientId: string;
  approvedColors: string[]; // e.g. ['#FAF8F5', '#121212', '#C85A32']
  approvedFonts: string[]; // e.g. ['Instrument Serif', 'Plus Jakarta Sans', 'JetBrains Mono']
  minHealthScore: number;
  lastAuditScore?: number;
}

export interface BrandComplianceReport {
  healthScore: number; // 0 to 100
  passedColors: string[];
  flaggedColors: { color: string; closestApproved: string; contrastRatio: number }[];
  passedFonts: string[];
  flaggedFonts: string[];
  contrastIssuesCount: number;
  recommendations: string[];
}
