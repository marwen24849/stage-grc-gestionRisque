import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ResponsableDashboardComponent } from './components/responsable-dashboard/responsable-dashboard.component';
import { SidebarComponent } from './share/sidebar/sidebar.component';
import { TopbarComponent } from './share/topbar/topbar.component';
import { ActiviteDashboardComponent } from './components/activite-dashboard/activite-dashboard.component';
import { ActifDashboardComponent } from './components/actif-dashboard/actif-dashboard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { AssetClassifierComponent } from './components/asset-classifier/asset-classifier.component';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/register/register.component';
import { ContactAdminComponent } from './components/contact-admin/contact-admin.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientDashboardComponent,
    ResponsableDashboardComponent,
    SidebarComponent,
    TopbarComponent,
    ActiviteDashboardComponent,
    ActifDashboardComponent,
    DashboardComponent,
    AssetClassifierComponent,
    AiAssistantComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    ContactAdminComponent,
    AccessDeniedComponent,
    UserManagementComponent
  ],
  imports: [
     BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule, 
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
