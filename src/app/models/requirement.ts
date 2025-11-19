export interface User {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface Comment {
  id: string;
  content: string;
  timestamp: string;
  user: User;
}

export type Priority = 'High' | 'Medium' | 'Low';

export type RequirementStatus = 'Draft' | 'In_Review' | 'Approved';

export interface Requirement {
  id: string;
  code: string; // e.g. REQ-001
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: Priority;
  status: RequirementStatus;
  author: User;
  comments: Comment[];
}
