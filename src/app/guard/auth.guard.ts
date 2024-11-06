import { AuthUserService } from './../services/authuser.service';
import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { tap, of, map } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authUserService = inject(AuthUserService);
  const isUserAuthenticated = authUserService.UserLoggedIn();

  if (isUserAuthenticated) {
    return true; // User is authenticated
  } else {
    // Attempt to refresh the user
    return authUserService.refreshUser().pipe(
      tap((res: any) => {
        if (res) {
          return true; // Successfully refreshed
        } else {
          localStorage.setItem('attemptedURL', state.url);
          router.navigateByUrl('login');
          return false; // Not authenticated and cannot refresh
        }
      }),
      // Convert the result to an observable of boolean
      map((res) => !!res)
    );
  }
};
