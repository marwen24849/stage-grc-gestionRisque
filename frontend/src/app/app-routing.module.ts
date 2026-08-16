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

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact-admin', component: ContactAdminComponent },
  { path: 'clients', component: ClientDashboardComponent },
  { path: 'clients/:clientId/responsables', component: ResponsableDashboardComponent },
  { path: 'responsables', component: ResponsableDashboardComponent },
  { path: 'activites/:responsableId', component: ActiviteDashboardComponent },
  { path: 'activites/:activiteId/actifs', component: ActifDashboardComponent },
  { path: 'actifs', component: ActifDashboardComponent },
  { path: 'classify/:assetId', component: AssetClassifierComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
