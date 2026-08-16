// app.component.ts (exemple d'intégration — adaptez à votre app.component existant)
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sidebarOpen = true;
  pageTitle = 'Tableau de bord';
  isLoginPage = false;

  private routeTitles: Record<string, string> = {
    '/tableau-de-bord': 'Tableau de bord',
    '/clients': 'Gestion des clients',
    '/responsables': 'Gestion des responsables',
    '/activites': 'Activités',
    '/actifs': 'Actifs',
    '/niveaux-classification': 'Niveaux de classification',
    '/utilisateurs': 'Utilisateurs',
    '/parametres': 'Paramètres',
  };

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects || e.url;
        const authRoutes = ['/login', '/forgot-password', '/register', '/contact-admin'];
        this.isLoginPage = authRoutes.some((route) => url.startsWith(route));
        this.pageTitle = this.routeTitles[url] || this.pageTitle;
        if (window.innerWidth <= 991.98) {
          this.sidebarOpen = false;
        }
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}