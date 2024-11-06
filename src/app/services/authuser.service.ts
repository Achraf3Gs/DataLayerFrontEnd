import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../model/User';
import { IUserLogin } from '../shared/intefaces/IUserLogin';
import { IUserRegister } from '../shared/intefaces/IuserRegister';
import { LocalStorageUser } from '../shared/intefaces/LocalStorageUser';
import { BusyService } from './busy.service';
import { environment } from '../../environments/environment';
import { state } from '@angular/animations';

const USER_KEY = 'user_key'; // Define USER_KEY as needed

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  secret = environment.secret;
  client = environment.client;

  localcalStorageUser: LocalStorageUser = {
    access_Token: '',
    refresh_Token: '',
    name: '',
    address: '',
    role: '',
    id: 0,
  };

  private token: string | null = null;
  helper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private busyService: BusyService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  UserLoggedIn(): boolean {
    const token = this.getAccess_TokenFromLocalStorage();
    if (!token) return false;

    const expirationTime = this.getTokenExpiration(token); // Get expiration time from the token
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

    return expirationTime > currentTime; // Return true if token is valid
  }

  // Helper function to get the expiration time from the token
  private getTokenExpiration(token: string): number {
    const decodedToken = this.decodeToken(token);
    return decodedToken?.exp || 0;
  }

  // Helper function to decode the JWT token
  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    } catch (error) {
      return null;
    }
  }

  login(userLogin: IUserLogin) {
    console.log('user to log in AuthUser', userLogin);
    this.busyService.busy();
    this.http
      .post('http://localhost:8080/api/v1/auth/authenticate', userLogin)
      .pipe(
        finalize(() => this.busyService.idle()) // This should be within the observable chain
      )
      .subscribe((res: any) => {
        if (res.access_Token) {
          this.toastrService.success('Logged in Successfully');
          this.localcalStorageUser.access_Token = res.access_Token;
          this.localcalStorageUser.refresh_Token = res.refresh_Token;
          this.localcalStorageUser.name = res.name;
          this.localcalStorageUser.address = res.address;
          this.localcalStorageUser.role = res.role;
          this.localcalStorageUser.id = res.id;
          localStorage.setItem(
            'LocalStorageUser',
            JSON.stringify(this.localcalStorageUser)
          );
          localStorage.setItem('access_Token', res.access_Token);
          localStorage.setItem('refresh_Token', res.refresh_Token);
          this.isUserLoggedIn.next(true);
          console.log(
            'access_Token Logged:',
            localStorage.getItem('access_Token')
          );

          const attemptedURL = localStorage.getItem('attemptedURL');
          if (attemptedURL) {
            this.router.navigateByUrl(attemptedURL);
            localStorage.removeItem('attemptedURL');
          } else {
            this.router.navigate(['navbar']);
          }
        } else {
          alert('Login failed');
        }
      });
  }

  register(userRegister: IUserRegister) {
    this.http
      .post('http://localhost:8080/api/v1/auth/register', userRegister)
      .subscribe((res: any) => {
        if (res.access_Token) {
          //  this.toastrService.success('Registering Successfully');
          finalize(() => this.busyService.idle());
          this.localcalStorageUser.access_Token = res.access_Token;
          this.localcalStorageUser.refresh_Token = res.refresh_Token;
          this.localcalStorageUser.name = res.name;
          this.localcalStorageUser.address = res.address;
          this.localcalStorageUser.role = res.role;
          this.localcalStorageUser.id = res.id;

          localStorage.setItem('access_Token', res.access_Token);
          localStorage.setItem('refresh_Token', res.refresh_Token);
          this.isUserLoggedIn.next(true);
          this.router.navigate(['login']);
        } else {
          alert('403');
        }
      });
  }

  logout(): void {
    const refreshToken = this.getRefresh_TokenFromLocalStorage();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${refreshToken}`)
      .set('secret', this.secret)
      .set('client', this.client);

    console.log('Headers:', headers);

    this.http
      .post('http://localhost:8080/api/v1/auth/logout', {}, { headers })
      .subscribe({
        next: (res: any) => {
          if (res.message) {
            // Remove only specific keys from localStorage
            localStorage.removeItem('access_Token');
            localStorage.removeItem('refresh_Token');
            localStorage.removeItem('LocalStorageUser');
            this.isUserLoggedIn.next(false);

            this.router.navigate(['login']); // Redirect to login page
          } else {
            alert('Logout failed');
          }
        },
        error: (error) => {
          console.error('Logout error:', error);
          alert('Logout failed');
        },
        complete: () => {
          console.log('Logout request completed');
        },
      });
  }

  refreshUser() {
    const refreshToken = this.getRefresh_TokenFromLocalStorage();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${refreshToken}`
    );

    return this.http
      .post('http://localhost:8080/api/v1/auth/refresh-token', {}, { headers })
      .pipe(
        map((res: any) => {
          if (res.access_Token && res.refresh_Token) {
            localStorage.setItem('access_Token', res.access_Token);
            localStorage.setItem('refresh_Token', res.refresh_Token);
            this.isUserLoggedIn.next(true);
            console.log('Token refreshed successfully');
          } else {
            console.error('Invalid refresh token');
            this.logout(); // Force logout
          }
          return true;
        }),
        catchError(() => {
          console.error('Token refresh failed, logging out');
          this.logout(); // Force logout
          return of(false);
        })
      );
  }

  getAccess_TokenFromLocalStorage(): string {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const access_Token = localStorage.getItem('access_Token');
      console.log('Retrieved Token:', access_Token);
      return access_Token || '';
    }
    return '';
  }

  getRefresh_TokenFromLocalStorage(): string {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const refresh_Token = localStorage.getItem('refresh_Token');
      console.log('Retrieved RefreshToken:', refresh_Token);
      return refresh_Token || '';
    }
    return '';
  }
}
