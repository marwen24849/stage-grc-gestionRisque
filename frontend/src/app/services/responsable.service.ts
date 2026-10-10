import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import env from '../config/env';
import { Responsable, ResponsableCreate } from '../models/responsable.model';

@Injectable({ providedIn: 'root' })
export class ResponsableService {
  private apiUrl = `${env.API_URL}/api/responsables`;

  private responsablesCache = new Map<number, Responsable[]>();
  private responsablesSubject = new BehaviorSubject<Responsable[]>([]);
  responsables$ = this.responsablesSubject.asObservable();

  private currentClientId: number | null = null;

  constructor(private http: HttpClient) {}

  loadResponsablesByClient(clientId: number): Observable<Responsable[]> {
    if (this.responsablesCache.has(clientId)) {
      const cached = this.responsablesCache.get(clientId)!;
      this.responsablesSubject.next(cached);
      this.currentClientId = clientId;
      return this.responsables$;
    }

    return this.http.get<Responsable[]>(`${this.apiUrl}/client/${clientId}`).pipe(
      tap(responsables => {
        this.responsablesCache.set(clientId, responsables);
        this.responsablesSubject.next(responsables);
        this.currentClientId = clientId;
      }),
      catchError(err => {
        console.error('Erreur chargement responsables', err);
        return throwError(() => err);
      })
    );
  }

  getResponsableById(id: number): Observable<Responsable> {
    return this.http.get<Responsable>(`${this.apiUrl}/${id}`);
  }

  createResponsable(data: ResponsableCreate): Observable<Responsable> {
    return this.http.post<Responsable>(this.apiUrl, data).pipe(
      tap(newResponsable => {
        const clientId = data.clientId;
        if (this.responsablesCache.has(clientId)) {
          const current = this.responsablesCache.get(clientId)!;
          this.responsablesCache.set(clientId, [...current, newResponsable]);
          if (this.currentClientId === clientId) {
            this.responsablesSubject.next(this.responsablesCache.get(clientId)!);
          }
        }
      })
    );
  }

  updateResponsable(id: number, updates: Partial<ResponsableCreate>): Observable<Responsable> {
    return this.http.put<Responsable>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updated => {
        const clientId = updated.clientId;
        if (this.responsablesCache.has(clientId)) {
          const list = this.responsablesCache.get(clientId)!;
          const index = list.findIndex(r => r.id === id);
          if (index !== -1) {
            list[index] = updated;
            this.responsablesCache.set(clientId, [...list]);
            if (this.currentClientId === clientId) {
              this.responsablesSubject.next(list);
            }
          }
        }
      })
    );
  }

  deleteResponsable(id: number, clientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        if (this.responsablesCache.has(clientId)) {
          const list = this.responsablesCache.get(clientId)!.filter(r => r.id !== id);
          this.responsablesCache.set(clientId, list);
          if (this.currentClientId === clientId) {
            this.responsablesSubject.next(list);
          }
        }
      })
    );
  }

  clearCache(): void {
    this.responsablesCache.clear();
    this.responsablesSubject.next([]);
    this.currentClientId = null;
  }
}