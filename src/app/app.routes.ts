import { Routes } from '@angular/router';
import { LoginComponent } from './Modules/Auth/pages/login/login.component';
import { RegisterComponent } from './Modules/Auth/pages/register/register.component';
import { DashboardComponent } from './Modules/Dashboard/pages/dashboard/dashboard.component';
import { authGuard } from './Guards/Auth/auth.guard';
import { protectedGuard } from './Guards/Auth/protected.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [protectedGuard] },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
