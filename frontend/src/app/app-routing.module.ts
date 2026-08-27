import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { ResponsableDashboardComponent } from './components/responsable-dashboard/responsable-dashboard.component';
import { ActiviteDashboardComponent } from './components/activite-dashboard/activite-dashboard.component';
import { ActifDashboardComponent } from './components/actif-dashboard/actif-dashboard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AssetClassifierComponent } from './components/asset-classifier/asset-classifier.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/register/register.component';
import { ContactAdminComponent } from './components/contact-admin/contact-admin.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact-admin', component: ContactAdminComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'utilisateurs', component: UserManagementComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] } },
  { path: 'clients', component: ClientDashboardComponent, canActivate: [authGuard] },
  { path: 'clients/:clientId/responsables', component: ResponsableDashboardComponent, canActivate: [authGuard] },
  { path: 'responsables', component: ResponsableDashboardComponent, canActivate: [authGuard] },
  { path: 'activites/:responsableId', component: ActiviteDashboardComponent, canActivate: [authGuard] },
  { path: 'activites/:activiteId/actifs', component: ActifDashboardComponent, canActivate: [authGuard] },
  { path: 'actifs', component: ActifDashboardComponent, canActivate: [authGuard] },
  { path: 'classify/:assetId', component: AssetClassifierComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN', 'CONSULTANT', 'CLIENT'] } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
