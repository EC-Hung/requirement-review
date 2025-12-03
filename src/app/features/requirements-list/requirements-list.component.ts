import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Requirement } from '../../models';

@Component({
  selector: 'app-requirements-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-semibold">Requirements</h1>
        <div class="text-sm text-slate-500">{{ requirements.length }} items</div>
      </div>

      <ul class="space-y-4">
        <li *ngFor="let r of requirements" class="bg-white p-4 rounded shadow">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-indigo-600 font-medium cursor-pointer" (click)="open(r.id)">{{ r.code }} — {{ r.title }}</div>
              <div class="text-sm text-slate-500">Priority: {{ r.priority }} • Status: {{ r.status }}</div>
            </div>
            <div class="text-sm text-slate-400">{{ r.author.name }}</div>
          </div>
        </li>
      </ul>
    </div>
  `
})
export class RequirementsListComponent {
  @Input({ required: true }) requirements: Requirement[] = [];
  @Output() requirementSelected = new EventEmitter<string>();

  open(id: string) {
    this.requirementSelected.emit(id);
  }
}
