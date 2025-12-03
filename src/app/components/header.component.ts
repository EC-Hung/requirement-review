import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() currentView: 'dashboard' | 'list' | 'detail' = 'dashboard';

  get viewTitle(): string {
    switch (this.currentView) {
      case 'dashboard': return 'ダッシュボード';
      case 'list': return '要求一覧';
      case 'detail': return '要求詳細';
    }
  }
}