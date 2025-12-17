import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';
import { RequirementService } from './requirement.service';
import { Requirement, Status, User, Comment, Priority } from './models';

const CURRENT_USER: User = {
  id: 'u1',
  name: 'アーキテクト 太郎',
  avatar: 'https://i.pravatar.cc/150?u=u1',
  role: 'ARCHITECT'
};

// --- 3. メインコンポーネント ---

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // --- State Management with Signals ---
  private requirementService = inject(RequirementService);
  
  // View State
  currentView = signal<'dashboard' | 'list' | 'detail'>('dashboard');
  activeProject = signal<string | null>(null);
  showCreateModal = signal(false);
  
  // Data State
  requirements = signal<Requirement[]>([]);
  selectedReq = signal<Requirement | null>(null);
  currentUser = CURRENT_USER;

  // Form State for new requirement
  newRequirement: Partial<Requirement> = {
    title: '',
    project: 'フェニックスプロジェクト',
    description: '',
    priority: 'MEDIUM',
    acceptanceCriteria: [''],
    dueDate: new Date()
  };
  
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

  ngOnInit(): void {
    this.requirementService.getRequirements().subscribe(reqs => {
      this.requirements.set(reqs);
    });
  }

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

  submitNewRequirement() {
    // Basic validation
    if (!this.newRequirement.title || !this.newRequirement.project) return;

    // Prepare the data for submission, filtering out empty AC items
    const payload = {
      ...this.newRequirement,
      acceptanceCriteria: this.newRequirement.acceptanceCriteria?.filter(ac => ac.trim() !== ''),
      authorId: this.currentUser.id, // Send the current user's ID as the author
      assigneeId: this.currentUser.id // For simplicity, assign to self initially
    };

    this.requirementService.createRequirement(payload).subscribe(createdReq => {
      this.requirements.update(reqs => [createdReq, ...reqs]);
      this.showCreateModal.set(false);
      // Reset form
      this.newRequirement = { title: '', project: 'フェニックスプロジェクト', description: '', priority: 'MEDIUM', acceptanceCriteria: [''], dueDate: new Date() };
      // Navigate to the new requirement's detail view
      this.selectRequirement(createdReq);
    });
  }

  updateStatus(newStatus: Status) {
    const current = this.selectedReq();
    if (!current) return;

    this.requirementService.updateRequirementStatus(current.id, newStatus).subscribe(updatedReq => {
      // Update in master list (immutable way)
      this.requirements.update(reqs => 
        reqs.map(r => r.id === current.id ? { ...r, status: newStatus } : r)
      );
      
      // Update current selected View
      this.selectedReq.set({ ...current, status: newStatus });
    });
  }

  addComment() {
    const currentReq = this.selectedReq()!;
    if (!this.newCommentText.trim() || !currentReq) return;

    this.requirementService.addComment(currentReq.id, { content: this.newCommentText.trim() }).subscribe(newComment => {
      // The service now returns a full comment object with author and a real timestamp
      this.selectedReq.update(req => req ? ({ ...req, comments: [...req.comments, newComment] }) : null);
      this.requirements.update(reqs => reqs.map(r => r.id === currentReq.id ? this.selectedReq()! : r));
    });

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

  // --- Helpers for Create Form ---
  addAcItem() {
    this.newRequirement.acceptanceCriteria?.push('');
  }

  removeAcItem(index: number) {
    this.newRequirement.acceptanceCriteria?.splice(index, 1);
  }

  trackByIndex(index: number, _: any) {
    return index;
  }

  // Helper to format date for input[type=date]
  formatDateForInput(date: Date | undefined): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  // Helper to handle date input changes
  onDateChange(dateString: string) {
    this.newRequirement.dueDate = dateString ? new Date(dateString) : new Date();
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
