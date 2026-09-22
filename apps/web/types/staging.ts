export type DevicePreset = 'desktop' | 'tablet' | 'mobile';

export interface DeviceConfig {
  id: DevicePreset;
  label: string;
  width: number;
  height: number;
  scale: number;
}

export type ScopeType = 'IN_SCOPE' | 'OUT_OF_SCOPE';
export type PinCategory = 'BUG' | 'CHANGE_REQUEST' | 'COPY_CHANGE';
export type ClientApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_APPLICABLE';

export interface StagingPin {
  id: string;
  xPercent: number;
  yPercent: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  device: DevicePreset;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio?: number;
  author: string;
  comment: string;
  createdAt: string;

  // Feature 1: Scope Firewall Triage
  pinCategory?: PinCategory;
  billableHours?: number;
  estimatedCostCents?: number;
  clientApprovalStatus?: ClientApprovalStatus;

  // Feature 2: Copy-Deck Sync
  originalText?: string;
  updatedText?: string;

  // DOM Anchor attributes
  selectorPath?: string;
  targetOffsetX?: number;
  targetOffsetY?: number;
  domSnippet?: string;
  consoleLogs?: string[];
  reanchorStatus?: 'ANCHORED' | 'REANCHOR_NEEDED';

  // Scope Defense & Retainer
  scopeType?: ScopeType;
  estimatedHours?: number;
  estimatedCostInCents?: number;
  stripePaymentUrl?: string;

  // GitHub & Branch Tagging
  githubIssueNumber?: number;
  githubIssueUrl?: string;
  prNumber?: number;
  previewUrl?: string;
}
