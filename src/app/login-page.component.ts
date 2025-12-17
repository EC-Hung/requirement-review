import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login.component';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div class="w-full max-w-md">
        <app-login></app-login>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  onLoggedIn() {
    // navigate to main application after successful login
    this.router.navigate(['/']);
  }
}
