import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page.component';
import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { AdminUsersComponent } from './admin/users.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard] },
  { path: '', component: AppComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];