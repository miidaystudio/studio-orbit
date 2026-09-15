export type ProjectStatus = 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED';
export type MilestoneStatus = 'UPCOMING' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'APPROVED';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate: string;
  status: MilestoneStatus;
  signedAt?: string;
  signedBy?: string;
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  clientToken: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  clientToken: string;
  status: ProjectStatus;
  budgetInCents: number;
  spentInCents: number;
  startDate: string;
  targetEndDate: string;
  milestones: Milestone[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}
