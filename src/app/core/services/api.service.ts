import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (environment.apiToken) {
      headers = headers.set('Authorization', `Token ${environment.apiToken}`);
    }
    return headers;
  }

  get<T>(url: string, params?: Record<string, string>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) httpParams = httpParams.set(key, value);
      });
    }
    return this.http.get<T>(url, {
      params: httpParams,
      headers: this.getHeaders()
    });
  }

  // Get list with automatic handling of paginated responses
  getList<T>(url: string, params?: Record<string, string>): Observable<T[]> {
    return this.get<T[] | PaginatedResponse<T>>(url, params).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        }
        return response.results || [];
      })
    );
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body, {
      headers: this.getHeaders()
    });
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body, {
      headers: this.getHeaders()
    });
  }

  patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(url, body, {
      headers: this.getHeaders()
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, {
      headers: this.getHeaders()
    });
  }
}
