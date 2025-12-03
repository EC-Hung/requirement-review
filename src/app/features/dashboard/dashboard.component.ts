import { Component, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Requirement } from '../../models';

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
  @Input({ required: true }) requirements: Requirement[] = [];

  private all = computed(() => this.requirements);

  // Pending = Draft or In_Review
  pending = computed(() => this.all().filter((r) => r.status === 'DRAFT' || r.status === 'IN_REVIEW').length);
  approved = computed(() => this.all().filter((r) => r.status === 'APPROVED').length);
  needsWork = computed(() => this.all().filter((r) => r.status === 'IN_REVIEW').length);

  get needsWorkList() {
    return this.all().filter((r) => r.status === 'IN_REVIEW');
  }
}
