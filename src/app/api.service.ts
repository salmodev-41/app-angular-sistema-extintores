import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

const API_BASE = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  get<T>(endpoint: string): Promise<T> {
    return this.request(this.http.get<T>(`${API_BASE}/${endpoint}`, { headers: this.headers() }));
  }

  post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request(this.http.post<T>(`${API_BASE}/${endpoint}`, data, { headers: this.headers() }));
  }

  put<T>(endpoint: string, id: string | number, data: unknown): Promise<T> {
    return this.request(this.http.put<T>(`${API_BASE}/${endpoint}/${id}`, data, { headers: this.headers() }));
  }

  delete(endpoint: string, id: string | number): Promise<void> {
    return this.request(this.http.delete<void>(`${API_BASE}/${endpoint}/${id}`, { headers: this.headers() }));
  }

  login(credentials: { email: string; senha: string }): Promise<{ token: string }> {
    return firstValueFrom(this.http.post<{ token: string }>(`${API_BASE}/auth/login`, credentials));
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private async request<T>(request: import('rxjs').Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(request);
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        void this.router.navigate(['/login']);
      }
      throw error;
    }
  }
}
