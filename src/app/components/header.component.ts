import { Component } from '@angular/core';
import { RequirementsService } from '../services/requirements.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="sticky top-0 bg-white border-b z-20">
      <div class="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div class="flex items-center gap-4">
          <div class="text-lg font-semibold text-slate-800">Requirement Review</div>
        </div>

        <div class="flex items-center gap-4 w-1/3">
          <input type="search" placeholder="Search requirements..." class="flex-1 border rounded px-3 py-2 text-sm" />
          <button class="p-2 rounded hover:bg-slate-100" aria-label="notifications">
            <!-- bell icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-sm text-slate-600">Alice</div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  constructor(private rs: RequirementsService) {}
}
