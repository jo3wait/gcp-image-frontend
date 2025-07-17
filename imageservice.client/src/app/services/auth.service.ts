import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.authApi}/api/auth`;
  private readonly metadataUrl =
    'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity';

  constructor(private http: HttpClient, private router: Router) { }

  /** 從 Cloud Run metadata server 抓 ID token */
  private fetchIdToken(): Promise<string> {
    const url = `${this.metadataUrl}?audience=${encodeURIComponent(
      this.api
    )}`;
    return fetch(url, {
      method: 'GET',
      headers: { 'Metadata-Flavor': 'Google' },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(
          `Failed to fetch ID token: ${res.status} ${res.statusText}`
        );
      }
      return res.text();
    });
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return from(this.fetchIdToken()).pipe(
      switchMap((idToken) =>
        this.http.post<AuthResponse>(
          `${this.api}/register`,
          { email, password },
          {
            headers: new HttpHeaders({
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            }),
          }
        )
      )
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // 先拿 ID token → 再把帳密一起送到後端
    return from(this.fetchIdToken()).pipe(
      switchMap((idToken) =>
        this.http.post<AuthResponse>(
          `${this.api}/login`,
          { email, password },
          {
            headers: new HttpHeaders({
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            }),
          }
        )
      ),
      tap((res) => {
        if (res.success && res.token) {
          localStorage.setItem('jwt', res.token);
          localStorage.setItem('email', email);
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

  // 取出目前使用者 Email
  get userEmail(): string | null {
    return localStorage.getItem('email');
  }

  get token(): string | null {
    return localStorage.getItem('jwt');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
