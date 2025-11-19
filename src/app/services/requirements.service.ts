import { Injectable, signal, computed, WritableSignal } from '@angular/core';
import type { Requirement, RequirementStatus, Comment } from '../models/requirement';
import { MOCK_DATA } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class RequirementsService {
  private _requirements: WritableSignal<Requirement[]> = signal<Requirement[]>(MOCK_DATA);

  /** public signal holding requirements */
  requirements = this._requirements;

  /** selected requirement id (or null) */
  selectedReq = signal<string | null>(null);

  /** simple view signal—'dashboard' | 'list' | 'detail' */
  currentView = signal<'dashboard' | 'list' | 'detail'>('dashboard');

  /** computed stats: pending and approved counts */
  stats = computed(() => {
    const all = this._requirements();
    const approved = all.filter((r: Requirement) => r.status === 'Approved').length;
    // treat non-approved as pending
    const pending = all.filter((r: Requirement) => r.status !== 'Approved').length;
    return { approved, pending };
  });

  getRequirement(id: string) {
    return computed(() => this._requirements().find((r: Requirement) => r.id === id) ?? null);
  }

  selectRequirement(id: string | null) {
    this.selectedReq.set(id);
  }

  setView(view: 'dashboard' | 'list' | 'detail') {
    this.currentView.set(view);
  }

  changeStatus(id: string, status: RequirementStatus) {
    this._requirements.update((list: Requirement[]) => list.map((r: Requirement) => (r.id === id ? { ...r, status } : r)));
  }

  addComment(id: string, comment: { userId: string; content: string; user: any }) {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      content: comment.content,
      timestamp: new Date().toISOString(),
      user: comment.user
    };
    this._requirements.update((list: Requirement[]) =>
      list.map((r: Requirement) => (r.id === id ? { ...r, comments: [...r.comments, newComment] } : r))
    );
  }
}
