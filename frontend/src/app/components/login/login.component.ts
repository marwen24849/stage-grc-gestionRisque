import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  onSubmit(): void {
    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Email ou mot de passe incorrect.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.authService.login({ email: this.email.trim(), password: this.password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        void this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    });
  }
}
