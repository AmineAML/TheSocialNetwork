import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators'
import { UserProfileData } from './data.service'

export interface LoginForm {
  email: string
  password: string
}

//Not all properties must specify them
export interface RegisterForm {
  username?: string
  email?: string
  password?: string
}

export class Tokens {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN = 'THE_SOCIAL_NETWORK_ACCESS_TOKEN';
  private readonly REFRESH_TOKEN = 'THE_SOCIAL_NETWORK_REFRESH_TOKEN';
  public loggedUsername: string;

  private loggedIn: Subject<boolean> = new ReplaySubject<boolean>(1);

  private ModifyAvatarLink: Subject<boolean> = new ReplaySubject<boolean>(1);

  constructor(private http: HttpClient,
    private router: Router) { }

  login(loginForm: LoginForm): Observable<boolean> {
    return this.http.post<any>('/api/v1/users/login', { email: loginForm.email, password: loginForm.password }).pipe(
      tap(tokens => {
        this.doLoginUser(tokens.data)

        this.loggedIn.next(true)
      }),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
  }

  logout() {
    return this.http.put<any>('/api/v1/users/logout', { headers: { 'authorization': this.getRefreshToken() } }).pipe(
      tap(() => {
        this.doLogoutUser()
      }),
      mapTo(true),
      catchError(error => {
        //alert(error.error);
        return of(false);
      }));
  }

  register(registerForm: RegisterForm) {
    return this.http.post<any>('/api/v1/users/user', registerForm).pipe(
      tap(tokens => {
        const t = {
          access_token: tokens.data.access_token,
          refresh_token: tokens.data.refresh_token
        }
        this.doLoginUser(t)

        this.loggedIn.next(true)

        this.router.navigate(['edit-profile'])
      }),
      mapTo(true),
      catchError(error => {
        const err = JSON.stringify(error.error.errors)
        alert(err);
        return of(false);
      }));
    //map(user => user)
  }

  loginStatusChange(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  public getAvatarLink(): Observable<boolean> {

    return this.ModifyAvatarLink.asObservable();
  }

  public setAvatarLink(value: boolean): void {

    this.ModifyAvatarLink.next(value);
  }

  authenticatedUser() {
    if (this.isLoggedIn) {
      return this.http.get<any>('/api/v1/users/user', { headers: { 'authorization': this.getAccessToken() } }).pipe(
        map((user: UserProfileData) => {
          return user.data.user.username
        }),
        //mapTo(true),
        catchError(error => {
          //alert(error.error);
          return of(false);
        }));
    }

    return null
  }

  refreshToken() {
    return this.http.post<any>('/api/v1/users/refresh_token', { refresh_token: this.getRefreshToken() }).pipe(
      tap((tokens) => {
        this.storeAccessToken(tokens.data.access_token);
      }),
      catchError(error => {
        this.invalidRefreshToken()

        throwError(error)

        return of(error)
      })
    );
  }

  private storeAccessToken(access_token: string) {
    localStorage.setItem(this.ACCESS_TOKEN, access_token);
  }

  isLoggedIn() {
    let loggedIn

    loggedIn = !!this.getAccessToken();

    if (loggedIn) {
      this.loggedIn.next(true)

      return true
    }

    return false
  }

  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private doLogoutUser() {
    this.loggedUsername = null;
    this.loggedIn.next(false)
    this.removeTokens();
  }

  private removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    this.redirectToLoginPage()
  }

  private redirectToLoginPage() {
    this.router.navigate(['/login'])
  }

  invalidRefreshToken() {
    this.doLogoutUser()
  }

  private doLoginUser(tokens: Tokens) {
    this.storeTokens(tokens);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.ACCESS_TOKEN, tokens.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
  }

  // login(loginForm: LoginForm) {
  //   return this.http.post<any>('/api/v1/users/login', { email: loginForm.email, password: loginForm.password }).pipe(
  //     map((data) => {
  //       console.log(data.data.access_token)
  //       localStorage.setItem('the-social-network', data.data.access_token)
  //       return data
  //     })
  //   )
  // }
}
