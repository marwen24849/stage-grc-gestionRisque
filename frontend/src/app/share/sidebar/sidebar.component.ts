
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

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

  constructor(private readonly authService: AuthService) {}

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  onNavClick(): void {
    this.userMenuOpen = false;
    
    this.closeSidebar.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}