export type Status = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'NEEDS_WORK';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'BA' | 'DEV' | 'PO' | 'ARCHITECT' | string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  type: 'GENERAL' | 'CHANGE_REQUEST';
}

export interface Requirement {
  id: string;
  title: string;
  code: string; // e.g., REQ-001
  description: string;
  acceptanceCriteria: string[];
  priority: Priority;
  status: Status;
  author: User;
  assignee: User;
  dueDate: Date;
  comments: Comment[];
  project: string;
}