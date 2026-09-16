export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';
export type ZoomPreset = '50%' | '75%' | '100%' | 'fit';
export type PinStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

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
  comments: PinComment[];
  createdAt: string;
}

