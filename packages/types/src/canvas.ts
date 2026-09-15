export interface Coordinate {
  xPercent: number; // percentage relative to canvas width (0-100)
  yPercent: number; // percentage relative to canvas height (0-100)
}

export type PinStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface PinComment {
  id: string;
  pinId: string;
  authorName: string;
  authorAvatar?: string;
  role: 'CLIENT' | 'STUDIO_ADMIN';
  content: string;
  createdAt: string;
}

export interface CanvasPinData {
  id: string;
  assetId: string;
  xPercent: number;
  yPercent: number;
  title: string;
  status: PinStatus;
  authorName: string;
  comments: PinComment[];
  createdAt: string;
}

export interface CanvasAssetVersion {
  id: string;
  versionNumber: number;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: string;
}

export interface PresenceUser {
  id: string;
  name: string;
  color: string;
  cursor?: Coordinate;
  activeAssetId?: string;
}
