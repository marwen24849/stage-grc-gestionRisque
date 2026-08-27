
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { Actif, ActifCreate } from '../models/actif.model';

@Injectable({ providedIn: 'root' })
export class ActifService {
  private apiUrl = 'http://localhost:8083/api/actifs';

  private actifsSubject = new BehaviorSubject<Actif[]>([]);
  actifs$ = this.actifsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadActifsByActivite(activiteId: number): Observable<Actif[]> {
    return this.http.get<Actif[]>(`${this.apiUrl}/activite/${activiteId}`).pipe(
      tap((actifs) => this.actifsSubject.next(actifs))
    );
  }

  getActifById(id: number): Observable<Actif> {
    return this.http.get<Actif>(`${this.apiUrl}/${id}`);
  }

  createActif(data: ActifCreate): Observable<Actif> {
    return this.http.post<Actif>(this.apiUrl, data).pipe(
      tap((newActif) => {
        const current = this.actifsSubject.value;
        this.actifsSubject.next([...current, newActif]);
      })
    );
  }

  updateActif(id: number, updates: Partial<ActifCreate>): Observable<Actif> {
    return this.http.put<Actif>(`${this.apiUrl}/${id}`, updates).pipe(
      tap((updated) => {
        const current = this.actifsSubject.value;
        const index = current.findIndex((a) => a.id === id);
        if (index !== -1) {
          current[index] = updated;
          this.actifsSubject.next([...current]);
        }
      })
    );
  }

  deleteActif(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.actifsSubject.value.filter((a) => a.id !== id);
        this.actifsSubject.next(current);
      })
    );
  }

  clearCache(): void {
    this.actifsSubject.next([]);
  }
}
