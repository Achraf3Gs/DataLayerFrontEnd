import { BusyService } from './busy.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
  Observable,
  EMPTY,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthUserService } from './authuser.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private secret = environment.secret;
  private client = environment.client;
  private isUserRefreshing = new BehaviorSubject<boolean>(false);

  constructor(
    private busyService: BusyService,
    private authUserService: AuthUserService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Skip the request if it's a login or registration request
    if (
      request.url.includes('/api/v1/auth/authenticate') ||
      request.url.includes('/api/v1/auth/register') ||
      request.url.includes('/api/v1/auth/logout')
    ) {
      // Don't add headers for login or register requests
      return next.handle(request);
    }

    // If user is logged in, add Authorization header
    if (this.authUserService.UserLoggedIn()) {
      console.log('Test1:' + this.authUserService.UserLoggedIn());
      request = this.addAuthHeaders(request);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authUserService.UserLoggedIn()) {
          if (!this.isUserRefreshing.getValue()) {
            this.isUserRefreshing.next(true);
            return this.authUserService.refreshUser().pipe(
              switchMap((res) => {
                this.isUserRefreshing.next(false);
                if (res) {
                  console.log('yesssssssssssssss');
                  // Retry the original request with the new token
                  const newToken =
                    this.authUserService.getAccess_TokenFromLocalStorage(); // Ensure it gets the new token
                  return next.handle(
                    this.addAuthHeaders(
                      request.clone({
                        setHeaders: { Authorization: `Bearer ${newToken}` },
                        setParams: {
                          secret: this.secret,
                          client: this.client,
                        },
                      })
                    )
                  );
                } else {
                  localStorage.setItem('attemptedURL', request.url);
                  this.authUserService.logout();
                  // Return EMPTY to terminate the observable if logout is triggered
                  return EMPTY;
                }
              }),
              catchError((refreshErr) => {
                this.isUserRefreshing.next(false);
                localStorage.setItem('attemptedURL', request.url);
                this.authUserService.logout();
                return throwError(() => refreshErr);
              })
            );
          }
          // Wait for token refresh to complete before retrying
          return this.isUserRefreshing.pipe(
            filter((isRefreshing) => !isRefreshing),
            take(1),
            switchMap(() => next.handle(this.addAuthHeaders(request)))
          );
        }
        return throwError(() => error);
      })
    );
  }

  private addAuthHeaders(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authUserService.getAccess_TokenFromLocalStorage();
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        setParams: {
          secret: this.secret,
          client: this.client,
        },
      });
    }
    return request;
  }
}
