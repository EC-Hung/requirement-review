import { Component } from '@angular/core';
import { RequirementsService } from '../services/requirements.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <div class="flex flex-col h-full">
      <div class="mb-6">
        <div class="text-2xl font-bold text-indigo-600">RQ</div>
        <div class="text-sm text-slate-500">Requirement Review</div>
      </div>

      <nav class="flex-1">
        <ul class="space-y-3">
          <li><button (click)="go('dashboard')" class="w-full text-left text-slate-700 hover:text-indigo-600">Dashboard</button></li>
          <li><button (click)="go('list')" class="w-full text-left text-slate-700 hover:text-indigo-600">Projects</button></li>
        </ul>
      </nav>

      <div class="mt-auto pt-4 border-t">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-200"></div>
          <div>
            <div class="text-sm font-medium">Alice Nakamura</div>
            <div class="text-xs text-slate-500">Product Manager</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SidebarComponent {
  constructor(private rs: RequirementsService) {}

  go(view: 'dashboard' | 'list') {
    this.rs.setView(view);
  }
}
