import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:5090/api/Auth';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUser: any = null;

  constructor(private http: HttpClient) {
    this.checkLoginStatus(); // restore state on refresh
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap(response => this.loginSuccess(response))
    );
  }

  loginSuccess(response: any) {
    const accessToken = response?.accessToken;
    const refreshToken = response?.refreshToken;
    const user = response?.user || response;

    if (!accessToken || !refreshToken) {
      console.error('AuthService.loginSuccess: missing token in login response', response);
      throw new Error('Missing authentication token');
    }

    this.currentUser = user;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    this.isLoggedInSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  clearSession() {
    this.currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.isLoggedInSubject.next(false);
  }

  logout(): Observable<any> {
    const user = this.getUser();
    const userId = user?.id ?? user?.userId ?? user?.ID ?? user?.userID;
    const refreshToken = localStorage.getItem('refreshToken');

    this.clearSession();

    if (!userId) {
      console.warn('Logout skipped API call because no user ID was found in localStorage user object:', user);
      return of(null);
    }

    console.log('Logging out user with ID:', userId, 'payload:', { userId, refreshToken });
    return this.http.post(`${this.apiUrl}/logout`, { userId, refreshToken }).pipe(
      catchError(err => {
        console.error('Logout API failed', err);
        return of(null);
      })
    );
  }

  // --- Refresh Token ---
  refreshToken(): Observable<any> {
    const token = this.getRefreshToken();
    if (!token) return of(null);
    console.log(token);

    return this.http.post(`${this.apiUrl}/refresh`, token).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      }),
      catchError(err => {
        console.error('Refresh token failed', err);
        this.clearSession(); // force logout on failure
        return of(null);
      })
    );
  }

  // Restore login state on page refresh
  checkLoginStatus() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      this.currentUser = JSON.parse(user);
      this.isLoggedInSubject.next(true);
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  // Get logged-in user
  getUser() {
    if (!this.currentUser) {
      this.currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    }
    // console.log('AuthService.getUser returns:', this.currentUser);
    return this.currentUser;
  }

  // optional helper
  isLoggedIn(): boolean {
    return !!this.currentUser || !!localStorage.getItem('user');
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));

    return payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }
}
