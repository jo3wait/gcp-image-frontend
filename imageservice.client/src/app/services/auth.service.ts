import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, Observable, of } from 'rxjs';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = '/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, { email, password });
  }

  // 取出目前使用者 Email
  get userEmail(): string | null {
    return localStorage.getItem('email');
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, { email, password }).pipe(
      tap(res => {
        if (res.success && res.token) {
          localStorage.setItem('jwt', res.token);
          localStorage.setItem('email', email);   // ← 儲存 Email
        }
      })
    );
  }

  // 登出同時移除 Email
  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return localStorage.getItem('jwt');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
