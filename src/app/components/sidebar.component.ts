import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../app.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() currentUser!: User;
  @Input() currentView: 'dashboard' | 'list' | 'detail' = 'dashboard';
  @Input() activeProject: string | null = null;
  @Output() viewChange = new EventEmitter<'dashboard'>();
  @Output() projectFilter = new EventEmitter<string>();
}