import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h3 class="text-lg font-bold mb-4">ログイン / サインアップ</h3>

      <form (ngSubmit)="onLogin()">
        <div class="mb-3">
          <label class="block text-sm">Email</label>
          <input [(ngModel)]="email" name="email" class="w-full border rounded px-3 py-2" required />
        </div>
        <div class="mb-3">
          <label class="block text-sm">Password</label>
          <input type="password" [(ngModel)]="password" name="password" class="w-full border rounded px-3 py-2" required />
        </div>
        <div class="flex justify-between gap-2">
          <button class="bg-indigo-600 text-white px-4 py-2 rounded" type="submit">ログイン</button>
          <button type="button" class="bg-gray-100 px-4 py-2 rounded" (click)="onSignup()">サインアップ</button>
        </div>
      </form>

      <div *ngIf="error" class="text-red-600 mt-3">{{ error }}</div>
    </div>
  `
})

export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  error: string | null = null;

  // emit an event when logged in so a page wrapper can redirect
  loggedIn = false;

  onLogin() {
    this.error = null;
    this.auth.login(this.email, this.password).subscribe({
      next: () => { this.loggedIn = true; this.router.navigate(['/']); },
      error: (err) => this.error = err?.error?.error || 'Login failed'
    });
  }

  onSignup() {
    this.error = null;
    const name = this.email.split('@')[0] || 'ユーザー';
    this.auth.register(name, this.email, this.password).subscribe({
      next: () => { this.loggedIn = true; this.router.navigate(['/']); },
      error: (err) => this.error = err?.error?.error || 'Signup failed'
    });
  }
}
