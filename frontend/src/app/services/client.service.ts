
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import env from '../config/env';
import { Client, ClientCreate } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private apiUrl = `${env.API_URL}/api/clients`;

  private clientsSubject = new BehaviorSubject<Client[]>([]);
  clients$ = this.clientsSubject.asObservable();

  constructor(private http: HttpClient) {}

  
  loadClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl).pipe(
      tap(clients => this.clientsSubject.next(clients))
    );
  }

  getClients(): Observable<Client[]> {
    
    if (this.clientsSubject.value.length === 0) {
      return this.loadClients();
    }
    return this.clients$;
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  createClient(client: ClientCreate): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client).pipe(
      tap(newClient => {
        const current = this.clientsSubject.value;
        this.clientsSubject.next([...current, newClient]);
      })
    );
  }

  updateClient(id: number, client: Partial<ClientCreate>): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client).pipe(
      tap(updated => {
        const current = this.clientsSubject.value;
        const index = current.findIndex(c => c.id === id);
        if (index !== -1) {
          current[index] = updated;
          this.clientsSubject.next([...current]);
        }
      })
    );
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.clientsSubject.value.filter(c => c.id !== id);
        this.clientsSubject.next(current);
      })
    );
  }
}