import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import env from '../config/env';
import { CreateUserRequest, ManagedUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${env.API_URL}/api/users`;

  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<ManagedUser[]> {
    return this.http.get<ManagedUser[]>(this.apiUrl);
  }

  createUser(request: CreateUserRequest): Observable<ManagedUser> {
    return this.http.post<ManagedUser>(this.apiUrl, request);
  }

  setEnabled(id: number, enabled: boolean): Observable<void> {
    const params = new HttpParams().set('enabled', enabled);
    return this.http.patch<void>(`${this.apiUrl}/${id}/enabled`, null, { params });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
