import type { Requirement, User, Comment } from './models/requirement';

const userAlice: User = { id: 'u-1', name: 'Alice Nakamura', avatar: '', role: 'Product Manager' };
const userBob: User = { id: 'u-2', name: 'Bob Tanaka', avatar: '', role: 'Engineer' };
const userCarol: User = { id: 'u-3', name: 'Carol Sato', avatar: '', role: 'QA' };

const c1: Comment = { id: 'c-101', content: 'Looks good overall, a few edge-cases need notes.', timestamp: new Date().toISOString(), user: userCarol };
const c2: Comment = { id: 'c-102', content: 'Please add localization considerations.', timestamp: new Date().toISOString(), user: userBob };

export const MOCK_DATA: Requirement[] = [
  {
    id: '1',
    code: 'REQ-001',
    title: 'User Authentication via SSO',
    description: 'Implement authentication using corporate SSO with password fallback. Ensure session management and remember-me functionality.',
    acceptanceCriteria: ['SSO login works with corporate provider', 'Password fallback with reset flow', 'Session persists for 30 days when remember-me enabled'],
    priority: 'High',
    status: 'Approved',
    author: userAlice,
    comments: [c1]
  },
  {
    id: '2',
    code: 'REQ-002',
    title: 'Export Reports to CSV',
    description: 'Allow users to export filtered report data to CSV. Include headers and support UTF-8 encoding.',
    acceptanceCriteria: ['CSV includes header row', 'Proper UTF-8 encoding', 'Export respects applied filters'],
    priority: 'Medium',
    status: 'In_Review',
    author: userBob,
    comments: [c2]
  },
  {
    id: '3',
    code: 'REQ-003',
    title: 'Bulk User Invite',
    description: 'Admins can upload a CSV with user emails to invite multiple users at once. Show a preview and validation before sending invites.',
    acceptanceCriteria: ['Preview of parsed CSV', 'Validation errors shown inline', 'Invites sent and status tracked'],
    priority: 'Low',
    status: 'Draft',
    author: userAlice,
    comments: []
  }
];
