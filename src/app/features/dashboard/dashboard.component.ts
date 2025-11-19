import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementsService } from '../../services/requirements.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-semibold mb-4">Dashboard</h1>
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="p-4 bg-white rounded shadow">Pending: {{ pending() }}</div>
        <div class="p-4 bg-white rounded shadow">Approved: {{ approved() }}</div>
        <div class="p-4 bg-white rounded shadow">In Review: {{ needsWork() }}</div>
      </div>
      <section class="bg-white p-4 rounded shadow">
        <h2 class="font-medium mb-2">Needs Attention</h2>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-slate-600">
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of needsWorkList" class="border-t">
              <td>{{ r.title }}</td>
              <td>{{ r.author?.name }}</td>
              <td>{{ r.status }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  `
})
export class DashboardComponent {
  constructor(private rs: RequirementsService) {}

  private all = this.rs.requirements;

  // Pending = Draft or In_Review
  pending = computed(() => this.all().filter((r: any) => r.status === 'Draft' || r.status === 'In_Review').length);
  approved = computed(() => this.all().filter((r: any) => r.status === 'Approved').length);
  needsWork = computed(() => this.all().filter((r: any) => r.status === 'In_Review').length);

  get needsWorkList() {
    return this.all().filter((r: any) => r.status === 'In_Review');
  }
}
