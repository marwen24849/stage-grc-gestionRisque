import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import env from '../config/env';
import { Activite, ActiviteCreate } from '../models/activite.model';

@Injectable({ providedIn: 'root' })
export class ActiviteService {
  private apiUrl = `${env.API_URL}/api/activites`;

  private activitesCache = new Map<number, Activite[]>();
  private activitesSubject = new BehaviorSubject<Activite[]>([]);
  activites$ = this.activitesSubject.asObservable();

  private currentResponsableId: number | null = null;

  constructor(private http: HttpClient) {}

  loadActivitesByResponsable(responsableId: number): Observable<Activite[]> {
    if (this.activitesCache.has(responsableId)) {
      const cached = this.activitesCache.get(responsableId)!;
      this.activitesSubject.next(cached);
      this.currentResponsableId = responsableId;
      return this.activites$;
    }

    return this.http.get<Activite[]>(`${this.apiUrl}/responsable/${responsableId}`).pipe(
      tap(activites => {
        this.activitesCache.set(responsableId, activites);
        this.activitesSubject.next(activites);
        this.currentResponsableId = responsableId;
      }),
      catchError(err => {
        console.error('Erreur chargement activités', err);
        return throwError(() => err);
      })
    );
  }

  getActiviteById(id: number): Observable<Activite> {
    return this.http.get<Activite>(`${this.apiUrl}/${id}`);
  }

  createActivite(data: ActiviteCreate): Observable<Activite> {
    return this.http.post<Activite>(this.apiUrl, data).pipe(
      tap(newActivite => {
        const responsableId = data.responsableId;
        if (this.activitesCache.has(responsableId)) {
          const current = this.activitesCache.get(responsableId)!;
          this.activitesCache.set(responsableId, [...current, newActivite]);
          if (this.currentResponsableId === responsableId) {
            this.activitesSubject.next(this.activitesCache.get(responsableId)!);
          }
        }
      })
    );
  }

  updateActivite(id: number, updates: Partial<ActiviteCreate>): Observable<Activite> {
    console.log('Updating activity with ID:', id, 'and updates:', updates);
    return this.http.put<Activite>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updated => {
        const responsableId = updated.responsableId;
        console.log('Responsable ID from updated activity:', responsableId);
        if (this.activitesCache.has(responsableId)) {
          const list = this.activitesCache.get(responsableId)!;
          const index = list.findIndex(a => a.id === id);
          if (index !== -1) {
            list[index] = updated;
            this.activitesCache.set(responsableId, [...list]);
            if (this.currentResponsableId === responsableId) {
              this.activitesSubject.next(list);
            }
          }
        }
      })
    );
  }

  deleteActivite(id: number, responsableId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        if (this.activitesCache.has(responsableId)) {
          const list = this.activitesCache.get(responsableId)!.filter(a => a.id !== id);
          this.activitesCache.set(responsableId, list);
          if (this.currentResponsableId === responsableId) {
            this.activitesSubject.next(list);
          }
        }
      })
    );
  }

  clearCache(): void {
    this.activitesCache.clear();
    this.activitesSubject.next([]);
    this.currentResponsableId = null;
  }
}