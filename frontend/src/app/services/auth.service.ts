import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthUser, LoginRequest, LoginResponse, Role } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8083/api/auth';
  private readonly tokenKey = 'grc_access_token';
  private readonly userKey = 'grc_current_user';

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        sessionStorage.setItem(this.tokenKey, response.token);
        sessionStorage.setItem(this.userKey, JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    sessionStorage.clear();
    void this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = this.decodePayload(token);
    return !!payload && typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): AuthUser | null {
    const value = sessionStorage.getItem(this.userKey);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value) as AuthUser;
    } catch {
      this.logout();
      return null;
    }
  }

  getRole(): Role | null {
    return this.getCurrentUser()?.role ?? null;
  }

  private decodePayload(token: string): { exp?: number } | null {
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(normalized)) as { exp?: number };
    } catch {
      return null;
    }
  }
}
