// topbar.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  // Titre de la page — à passer depuis chaque page, ex: <app-topbar title="Gestion des clients">
  @Input() title = 'Tableau de bord';
  @Input() notificationCount = 0;

  // Émis quand on clique sur le bouton hamburger (utile en mobile pour ouvrir la sidebar)
  @Output() menuToggle = new EventEmitter<void>();

  userMenuOpen = false;

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }
}