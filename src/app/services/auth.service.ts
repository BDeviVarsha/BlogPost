import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'https://localhost:7249/api/Auth';

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
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  loginSuccess(response: any) {
    const token = response?.token || response?.accessToken;
    const user = response?.user || response;

    if (!token) {
      console.error('AuthService.loginSuccess: missing token in login response', response);
      throw new Error('Missing authentication token');
    }

    this.currentUser = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.isLoggedInSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user?.id ?? user?.userId ?? user?.ID ?? user?.userID;

    if (!userId) {
      console.warn('Logout skipped API call because no user ID was found in localStorage user object:', user);
      this.currentUser = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.isLoggedInSubject.next(false);
      return of(null);
    }

    console.log('Logging out user with ID:', userId, 'payload:', { userId });
    return this.http.post(`${this.apiUrl}/logout`, { userId }).pipe(
      tap(() => {
        this.currentUser = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.isLoggedInSubject.next(false);
      }),
      catchError(err => {
        console.error('Logout API failed', err);
        this.currentUser = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.isLoggedInSubject.next(false);
        return of(null);
      })
    );
  }

  // Restore login state on page refresh
  checkLoginStatus() {
    const user = localStorage.getItem('user');

    if (user) {
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
}
