import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="flex-shrink-0 h-20 flex items-center justify-between px-8 border-b border-slate-200 bg-white">
      <div>
        <h2 class="text-xl font-bold text-slate-800">{{ getTitle() }}</h2>
      </div>
      <div class="flex items-center gap-4">
        <ng-container *ngIf="auth.currentUser(); else showLogin">
          <img [src]="auth.currentUser()?.avatar" class="w-8 h-8 rounded-full" [title]="auth.currentUser()?.name" />
          <div class="text-sm text-slate-700">{{ auth.currentUser()?.name }}</div>
          <button (click)="logout()" class="bg-gray-100 px-3 py-1 rounded">Logout</button>
        </ng-container>
        <ng-template #showLogin>
          <button (click)="goLogin()" class="bg-indigo-600 text-white px-3 py-1 rounded">Login</button>
        </ng-template>
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

  auth = inject(AuthService);
  private router = inject(Router);

  getTitle(): string {
    if (this.currentView === 'dashboard') return 'ダッシュボード';
    if (this.currentView === 'list') return '要求一覧';
    return '要求詳細';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}