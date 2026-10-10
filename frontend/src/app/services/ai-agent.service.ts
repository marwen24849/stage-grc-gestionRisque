import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import env from '../config/env';

@Injectable({ providedIn: 'root' })
export class AiAgentService {
  private readonly apiUrl = `${env.API_URL}/ai/chat`;

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<string> {
    const params = new HttpParams().set('message', message);

    return this.http.get(this.apiUrl, {
      params,
      responseType: 'text'
    }).pipe(
      map((response) => response || 'Je n\'ai pas pu générer de réponse pour le moment.')
    );
  }
}
