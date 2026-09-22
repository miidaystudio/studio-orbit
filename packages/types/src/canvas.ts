export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';
export type ZoomPreset = '50%' | '75%' | '100%' | 'fit';
export type PinStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type ScopeType = 'IN_SCOPE' | 'OUT_OF_SCOPE';
export type PinCategory = 'BUG' | 'CHANGE_REQUEST' | 'COPY_CHANGE';
export type ClientApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_APPLICABLE';

export interface PinComment {
  id: string;
  pinId: string;
  authorName: string;
  authorRole?: 'CLIENT' | 'STUDIO_ADMIN';
  role?: 'CLIENT' | 'STUDIO_ADMIN';
  content: string;
  createdAt: string;
}

export interface CanvasPinData {
  id: string;
  projectId?: string;
  assetId?: string;
  xPercent: number;
  yPercent: number;
  deviceViewport?: DeviceViewport;
  userAgent?: string;
  title: string;
  authorName?: string;
  status: PinStatus;

  // Feature 1: Scope Firewall Triage
  pinCategory?: PinCategory;
  billableHours?: number;
  estimatedCostCents?: number;
  clientApprovalStatus?: ClientApprovalStatus;

  // Feature 2: Copy-Deck Sync
  originalText?: string;
  updatedText?: string;

  // DOM Anchor & Viewport Attributes
  selectorPath?: string;
  targetOffsetX?: number;
  targetOffsetY?: number;
  domSnippet?: string;
  viewportWidth?: number;
  viewportHeight?: number;
  devicePixelRatio?: number;
  consoleLogs?: string[];
  reanchorStatus?: 'ANCHORED' | 'REANCHOR_NEEDED';

  // Scope Defense & Retainer Tracking
  scopeType?: ScopeType;
  estimatedHours?: number;
  estimatedCostInCents?: number;
  stripePaymentUrl?: string;

  // GitHub & Branch Tagging
  githubIssueNumber?: number;
  githubIssueUrl?: string;
  prNumber?: number;
  previewUrl?: string;

  comments: PinComment[];
  createdAt: string;
}

