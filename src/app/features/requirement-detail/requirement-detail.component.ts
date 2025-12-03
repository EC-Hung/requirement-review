import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from '../../components/comment-section.component';
import { Requirement, Status } from '../../models';

@Component({
  selector: 'app-requirement-detail',
  standalone: true,
  imports: [CommonModule, CommentSectionComponent],
  template: `
    <div class="max-w-6xl mx-auto grid grid-cols-12 gap-6">
      <ng-container *ngIf="req">
        <div class="col-span-8">
          <div class="bg-white p-6 rounded-2xl shadow">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-lg font-semibold">{{ req.code }} — {{ req.title }}</div>
                <div class="text-sm text-slate-500">Author: {{ req.author.name }} • Priority: {{ req.priority }}</div>
              </div>
              <div class="flex gap-2">
                <button (click)="approve()" class="px-4 py-2 bg-green-600 text-white rounded-full">Approve</button>
                <button (click)="requestChanges()" class="px-4 py-2 bg-red-500 text-white rounded-full">Request Changes</button>
              </div>
            </div>

            <section class="mt-4">
              <h3 class="font-medium">Description</h3>
              <p class="text-sm text-slate-700 mt-2">{{ req.description }}</p>
            </section>

            <section class="mt-4">
              <h3 class="font-medium">Acceptance Criteria</h3>
              <ul class="list-disc pl-6 mt-2 text-sm">
                <li *ngFor="let a of req.acceptanceCriteria">{{ a }}</li>
              </ul>
            </section>
          </div>
        </div>

        <div class="col-span-4">
          <div class="bg-white p-6 rounded-2xl shadow">
            <app-comment-section></app-comment-section>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class RequirementDetailComponent {
  @Input({ required: true }) req: Requirement | null = null;
  @Output() statusChanged = new EventEmitter<Status>();

  // We will need to pass comments down to the comment-section
  // @Input() comments: Comment[] = [];
  // @Output() commentAdded = new EventEmitter<string>();

  approve() {
    this.statusChanged.emit('APPROVED');
  }

  requestChanges() {
    this.statusChanged.emit('NEEDS_WORK');
  }
}
