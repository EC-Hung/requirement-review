import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';

// --- 1. インターフェースと型 (データ定義) ---

type Status = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'NEEDS_WORK';
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'BA' | 'DEV' | 'PO' | 'ARCHITECT' | string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  type: 'GENERAL' | 'CHANGE_REQUEST';
}

interface Requirement {
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

// --- 2. モックデータ (擬似データ) ---

const CURRENT_USER: User = {
  id: 'u1',
  name: 'アーキテクト 太郎',
  avatar: 'https://i.pravatar.cc/150?u=u1',
  role: 'ARCHITECT'
};

const MOCK_REQS: Requirement[] = [
  {
    id: '1',
    code: 'REQ-2024-001',
    title: 'GoogleによるSSOログイン連携',
    project: 'フェニックスプロジェクト',
    description: 'システムは、社内ユーザーが会社のGoogle Workspaceアカウントを使用してログインできるようにする必要があります。2段階認証が必須です。',
    acceptanceCriteria: [
      'ログインページに「Googleでログイン」ボタンが表示される',
      '@company.comドメインのみを受け入れる',
      '初回ログイン時にユーザープロファイルを自動的に作成する'
    ],
    priority: 'HIGH',
    status: 'IN_REVIEW',
    author: { id: 'u2', name: 'ビジネスアナリスト 花子', avatar: 'https://i.pravatar.cc/150?u=u2', role: 'BA' },
    assignee: CURRENT_USER,
    dueDate: new Date('2024-12-01'),
    comments: [
      {
        id: 'c1',
        userId: 'u2',
        userName: 'ビジネスアナリスト 花子',
        userAvatar: 'https://i.pravatar.cc/150?u=u2',
        content: '昨日のフィードバックに従ってフローを更新しました。ご確認をお願いします。',
        timestamp: new Date(Date.now() - 86400000),
        type: 'GENERAL'
      }
    ]
  },
  {
    id: '2',
    code: 'REQ-2024-005',
    title: 'リアルタイム収益レポートダッシュボード',
    project: 'フェニックスプロジェクト',
    description: '日中の収益を表示する折れ線グラフを構築し、5分ごとに更新します。',
    acceptanceCriteria: ['データ読み込みが2秒未満であること', '支店によるフィルター機能があること', 'データをExcelにエクスポートできること'],
    priority: 'MEDIUM',
    status: 'DRAFT',
    author: { id: 'u2', name: 'ビジネスアナリスト 花子', avatar: 'https://i.pravatar.cc/150?u=u2', role: 'BA' },
    assignee: CURRENT_USER,
    dueDate: new Date('2024-12-10'),
    comments: []
  },
  {
    id: '3',
    code: 'REQ-2024-012',
    title: 'APIゲートウェイのレート制限',
    project: 'コアインフラストラクチャ',
    description: '各パブリックIPに対して1000リクエスト/分の制限を設定します。',
    acceptanceCriteria: ['しきい値を超えた場合に429 Too Many Requestsを返す', 'オフィスのIPをホワイトリストに登録する', '違反したIPをログに記録する'],
    priority: 'HIGH',
    status: 'APPROVED',
    author: { id: 'u3', name: '開発リーダー 鈴木', avatar: 'https://i.pravatar.cc/150?u=u3', role: 'DEV' },
    assignee: CURRENT_USER,
    dueDate: new Date('2024-11-20'),
    comments: []
  }
];

// --- 3. メインコンポーネント ---

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // --- State Management with Signals ---
  
  // View State
  currentView = signal<'dashboard' | 'list' | 'detail'>('dashboard');
  activeProject = signal<string | null>(null);
  
  // Data State
  requirements = signal<Requirement[]>(MOCK_REQS);
  selectedReq = signal<Requirement | null>(null);
  currentUser = CURRENT_USER;
  
  // Form State
  newCommentText = '';

  // --- Computed Signals (Derived State) ---
  
  filteredRequirements = computed(() => {
    let reqs = this.requirements();
    if (this.activeProject()) {
      reqs = reqs.filter(r => r.project === this.activeProject());
    }
    return reqs;
  });

  stats = computed(() => {
    const reqs = this.requirements();
    return {
      pending: reqs.filter(r => r.status === 'IN_REVIEW').length,
      approved: reqs.filter(r => r.status === 'APPROVED').length,
      draft: reqs.filter(r => r.status === 'DRAFT').length
    };
  });

  // --- Actions ---

  setView(view: 'dashboard' | 'list' | 'detail') {
    this.currentView.set(view);
    if (view !== 'detail') {
      this.selectedReq.set(null);
    }
  }

  filterProject(projectName: string) {
    this.activeProject.set(projectName);
    this.setView('list');
  }

  selectRequirement(req: Requirement) {
    this.selectedReq.set(req);
    this.setView('detail');
  }

  updateStatus(newStatus: Status) {
    const current = this.selectedReq();
    if (!current) return;

    // Update in master list (immutable way)
    this.requirements.update(reqs => 
      reqs.map(r => r.id === current.id ? { ...r, status: newStatus } : r)
    );
    
    // Update current selected View
    this.selectedReq.set({ ...current, status: newStatus });
  }

  addComment() {
    if (!this.newCommentText.trim() || !this.selectedReq()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar,
      content: this.newCommentText,
      timestamp: new Date(),
      type: 'GENERAL'
    };

    const currentReq = this.selectedReq()!;
    const updatedReq = {
      ...currentReq,
      comments: [...currentReq.comments, newComment]
    };

    // Update state
    this.requirements.update(reqs => 
      reqs.map(r => r.id === currentReq.id ? updatedReq : r)
    );
    this.selectedReq.set(updatedReq);

    // Reset form
    this.newCommentText = '';
  }

  addCommentOnEnter(event: KeyboardEvent) {
    // Submit on Enter, but allow Shift+Enter for new lines
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent new line in textarea
      this.addComment();
    }
  }

  // --- Helpers for UI Classes ---

  getStatusClass(status: Status): string {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border border-green-200';
      case 'IN_REVIEW': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'NEEDS_WORK': return 'bg-red-50 text-red-600 border border-red-200';
      default: return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  }

  getStatusLabel(status: Status): string {
    switch (status) {
      case 'APPROVED': return '承認済み';
      case 'IN_REVIEW': return 'レビュー中';
      case 'NEEDS_WORK': return '要修正';
      case 'DRAFT': return '下書き';
      default: return status;
    }
  }

  getPriorityClass(p: Priority): string {
    switch (p) {
      case 'HIGH': return 'text-red-600 bg-red-50 px-2 py-1 rounded';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 px-2 py-1 rounded';
      case 'LOW': return 'text-slate-500 bg-slate-100 px-2 py-1 rounded';
    }
  }

  getPriorityDotClass(p: Priority): string {
    switch (p) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'LOW': return 'bg-slate-400';
    }
  }

  // trackBy helpers
  trackByReq(_: number, r: Requirement) { return r.id; }
  trackByComment(_: number, c: Comment) { return c.id; }
  trackByValue(_: number, v: any) { return v; }
}
