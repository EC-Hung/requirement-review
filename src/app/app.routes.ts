import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RequirementsListComponent } from './features/requirements-list/requirements-list.component';
import { RequirementDetailComponent } from './features/requirement-detail/requirement-detail.component';

export const appRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'list', component: RequirementsListComponent },
  { path: 'requirement/:id', component: RequirementDetailComponent },
  { path: '**', redirectTo: '' }
];
