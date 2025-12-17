import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-3xl mx-auto">
      <h2 class="text-xl font-bold mb-4">ユーザー管理</h2>

      <form (ngSubmit)="createUser()" class="mb-6 grid grid-cols-3 gap-3">
        <input [(ngModel)]="name" name="name" placeholder="Name" class="border px-3 py-2 rounded col-span-1" required />
        <input [(ngModel)]="email" name="email" placeholder="Email" class="border px-3 py-2 rounded col-span-1" required />
        <input [(ngModel)]="password" name="password" placeholder="Password" class="border px-3 py-2 rounded col-span-1" required />
        <select [(ngModel)]="role" name="role" class="border px-3 py-2 rounded col-span-1">
          <option value="DEV">DEV</option>
          <option value="BA">BA</option>
          <option value="PO">PO</option>
          <option value="ARCHITECT">ARCHITECT</option>
        </select>
        <button class="bg-indigo-600 text-white px-4 py-2 rounded col-span-1">Create</button>
      </form>

      <table class="w-full text-left">
        <thead class="text-sm text-slate-500">
          <tr><th class="p-2">Name</th><th class="p-2">Email</th><th class="p-2">Role</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of users" class="border-t"><td class="p-2">{{u.name}}</td><td class="p-2">{{u.email}}</td><td class="p-2">{{u.role}}</td></tr>
        </tbody>
      </table>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  private http = inject(HttpClient);
  users: Array<any> = [];

  name = '';
  email = '';
  password = '';
  role = 'DEV';

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.http.get<any[]>('http://localhost:3001/api/admin/users').subscribe(u => this.users = u);
  }

  createUser() {
    this.http.post('http://localhost:3001/api/admin/users', { name: this.name, email: this.email, password: this.password, role: this.role }).subscribe({ next: () => { this.name=''; this.email=''; this.password=''; this.fetch(); }, error: (e) => alert(e?.error?.error || 'Failed') });
  }
}
