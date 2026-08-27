import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { LoginResponse } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const response: LoginResponse = {
    token: 'header.eyJleHAiOjQxMDAwMDAwMDAwMDAwfQ.signature',
    user: { id: 1, firstName: 'A', lastName: 'User', email: 'user@example.com', role: 'CLIENT', enabled: true }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });

  it('stores the token and public user after login', () => {
    service.login({ email: 'user@example.com', password: 'secret' }).subscribe();
    const request = http.expectOne('http://localhost:8083/api/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'user@example.com', password: 'secret' });
    request.flush(response);

    expect(service.getToken()).toBe(response.token);
    expect(service.getCurrentUser()).toEqual(response.user);
    expect(service.getRole()).toBe('CLIENT');
  });

  it('clears authentication data on logout', () => {
    sessionStorage.setItem('grc_access_token', response.token);
    sessionStorage.setItem('grc_current_user', JSON.stringify(response.user));

    service.logout();

    expect(sessionStorage.length).toBe(0);
  });
});
