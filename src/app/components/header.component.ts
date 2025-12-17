import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="flex-shrink-0 h-20 flex items-center justify-between px-8 border-b border-slate-200 bg-white">
      <div>
        <h2 class="text-xl font-bold text-slate-800">{{ getTitle() }}</h2>
      </div>
      <div>
        <button (click)="createClick.emit()" class="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 text-sm font-medium transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新しい要求を作成
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input() currentView: 'dashboard' | 'list' | 'detail' = 'dashboard';
  @Output() createClick = new EventEmitter<void>();

  getTitle(): string {
    if (this.currentView === 'dashboard') return 'ダッシュボード';
    if (this.currentView === 'list') return '要求一覧';
    return '要求詳細';
  }
}