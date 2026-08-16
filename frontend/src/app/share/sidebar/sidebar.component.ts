// sidebar.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface NavItem {
  label: string;
  icon: string;   
  route: string;  
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Contrôle l'affichage en overlay mobile (piloté par le topbar/parent)
  @Input() open = false;
  @Output() closeSidebar = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Tableau de bord',            icon: 'bi-house-door',       route: '/tableau-de-bord' },
    { label: 'Clients',                    icon: 'bi-people',           route: '/clients' },
    { label: 'Responsables',                icon: 'bi-person-badge',     route: '/responsables' },
    { label: 'Activités',                   icon: 'bi-clipboard-check',  route: '/activites' },
    { label: 'Actifs',                      icon: 'bi-box-seam',         route: '/actifs' },
    { label: 'Classification          ',   icon: 'bi-layers',           route: '/niveaux-classification' },
    { label: 'Utilisateurs',                icon: 'bi-people',     route: '/utilisateurs' },
    { label: 'Paramètres',                  icon: 'bi-gear',             route: '/parametres' },
  ];

  userMenuOpen = false;

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  onNavClick(): void {
    this.userMenuOpen = false;
    // referme le menu mobile après un clic sur un lien
    this.closeSidebar.emit();
  }
}