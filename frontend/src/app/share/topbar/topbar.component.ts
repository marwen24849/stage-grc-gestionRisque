
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  
  @Input() title = 'Tableau de bord';
  @Input() notificationCount = 0;

  
  @Output() menuToggle = new EventEmitter<void>();

  userMenuOpen = false;

  constructor(private readonly authService: AuthService) {}

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }
}