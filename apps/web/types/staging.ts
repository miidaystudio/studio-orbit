export type DevicePreset = 'desktop' | 'tablet' | 'mobile';

export interface DeviceConfig {
  id: DevicePreset;
  label: string;
  width: number;
  height: number;
  scale: number;
}

export interface StagingPin {
  id: string;
  xPercent: number;
  yPercent: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  device: DevicePreset;
  viewportWidth: number;
  viewportHeight: number;
  author: string;
  comment: string;
  createdAt: string;
  githubIssueUrl?: string;
}
