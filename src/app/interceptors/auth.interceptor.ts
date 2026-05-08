import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.getToken();
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Attempt refresh token
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.authService.getToken();
              if (!newToken) return throwError(() => err);

              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next.handle(retryReq);
            })
          );
        }

        return throwError(() => err);
      })
    );
  }
}
