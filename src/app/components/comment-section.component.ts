import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../models';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h4 class="font-medium">Discussion</h4>
      <div class="mt-3 space-y-3 max-h-64 overflow-auto">
        <div *ngFor="let c of comments" class="p-3 bg-slate-50 rounded"> // The template needs to be updated to use c.author.name
          <div class="text-sm font-medium">{{ c.user.name }} <span class="text-xs text-slate-400">• {{ c.timestamp | date:'short' }}</span></div>
          <div class="text-sm text-slate-700">{{ c.content }}</div>
        </div>
      </div>

      <div class="mt-4">
        <textarea [(ngModel)]="newComment" rows="3" class="w-full border rounded p-2 text-sm" placeholder="Write a comment..."></textarea>
        <div class="mt-2 flex justify-end">
          <button (click)="post()" class="px-4 py-2 bg-indigo-600 text-white rounded">Post comment</button>
        </div>
      </div>
    </div>
  `
})
export class CommentSectionComponent {
  @Input({ required: true }) comments: Comment[] = [];
  @Output() commentAdded = new EventEmitter<string>();

  newComment = '';

  post() {
    if (!this.newComment.trim()) return;
    this.commentAdded.emit(this.newComment.trim());
    this.newComment = '';
  }
}
