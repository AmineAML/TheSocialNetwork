import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of, ReplaySubject, Subject, throwError } from 'rxjs'
import { catchError, map, mapTo, tap } from 'rxjs/operators'
import { LoginForm, RegisterForm, UserProfileData, Tokens } from '../../shared/models'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    //private readonly ACCESS_TOKEN = 'THE_SOCIAL_NETWORK_ACCESS_TOKEN';

    //private readonly REFRESH_TOKEN = 'THE_SOCIAL_NETWORK_REFRESH_TOKEN';

    public loggedUsername: string

    private loggedIn: Subject<boolean> = new ReplaySubject<boolean>(1)

    private modifyAvatarLink: Subject<boolean> = new ReplaySubject<boolean>(1)

    private confirmedEmailLink: Subject<boolean> = new ReplaySubject<boolean>(1)

    private accessToken: string = null

    private modifyLoggedInUsername: Subject<boolean> = new ReplaySubject<boolean>(1)

    private refreshTokenTimeout

    constructor(private http: HttpClient, private router: Router) {}

    login(loginForm: LoginForm): Observable<boolean> {
        return this.http
            .post<any>('/api/v1/users/login', {
                email: loginForm.email,
                password: loginForm.password
            })
            .pipe(
                tap(tokens => {
                    this.doLoginUser(tokens.data)

                    this.loggedIn.next(true)

                    this.startRefreshTokenTimer()
                }),
                mapTo(true),
                catchError(error =>
                    //alert(error.error);
                    of(false)
                )
            )
    }

    logout() {
        return this.http
            .put<any>('/api/v1/users/logout', {
                /*headers: { 'authorization': this.getRefreshToken() }*/
            })
            .pipe(
                tap(() => {
                    this.doLogoutUser()

                    this.stopRefreshTokenTimer()
                }),
                mapTo(true),
                catchError(error =>
                    //alert(error.error);
                    of(false)
                )
            )
    }

    register(registerForm: RegisterForm) {
        return this.http.post<any>('/api/v1/users/user', registerForm).pipe(
            tap(tokens => {
                const t = {
                    accessToken: tokens.data.access_token,
                    refreshToken: tokens.data.refresh_token
                }
                this.doLoginUser(t)

                this.loggedIn.next(true)

                this.startRefreshTokenTimer()

                this.router.navigate(['edit-profile'])
            }),
            mapTo(true),
            catchError(error => {
                const err = JSON.stringify(error.error.errors)
                alert(err)
                return of(false)
            })
        )
    }

    delete(id: string) {
        return this.http.delete<any>(`/api/v1/users/user/${id}`).pipe(
            tap(account => {
                this.doLogoutUser()

                this.stopRefreshTokenTimer()
            }),
            mapTo(true),
            catchError(error => of(false))
        )
    }

    refreshToken() {
        //Apply withCredential meaning allow sending cookies which contain the refresh token
        return this.http
            .post<any>(
                '/api/v1/users/refresh_token',
                {
                    /*refresh_token: this.getRefreshToken()*/
                },
                { withCredentials: true }
            )
            .pipe(
                tap(tokens => {
                    //If refresh token cookie was sent empty meaning client is not authenticated and the server response is an empty access token
                    if (tokens.data.access_token) {
                        this.storeAccessToken(tokens.data.access_token)

                        this.startRefreshTokenTimer()

                        this.loggedIn.next(true)
                    } else {
                        this.loggedIn.next(false)
                    }
                }),
                catchError(error => {
                    this.invalidRefreshToken()

                    throwError(error)

                    return of(error)
                })
            )
    }

    authenticatedUser() {
        // console.log('ree')
        if (this.isLoggedIn) {
            return this.http
                .get<any>('/api/v1/users/user', {
                    headers: { authorization: this.getAccessToken() }
                })
                .pipe(
                    map((user: UserProfileData) => user.data.user.username),
                    catchError(error =>
                        //alert(error.error);
                        of(false)
                    )
                )
        }

        return null
    }

    public loginStatusChange(): Observable<boolean> {
        return this.loggedIn.asObservable()
    }

    public getAvatarLink(): Observable<boolean> {
        return this.modifyAvatarLink.asObservable()
    }

    public setAvatarLink(value: boolean): void {
        this.modifyAvatarLink.next(value)
    }

    public getLoggedInUsername(): Observable<boolean> {
        return this.modifyLoggedInUsername.asObservable()
    }

    public setLoggedInUsername(value: boolean): void {
        this.modifyLoggedInUsername.next(value)
    }

    public getConfirmedEmailLink(): Observable<boolean> {
        return this.confirmedEmailLink.asObservable()
    }

    public setConfirmedEmailLink(value: boolean): void {
        this.confirmedEmailLink.next(value)
    }

    public isLoggedIn() {
        const loggedIn = !!this.getAccessToken()

        // console.log('ree')

        if (loggedIn) {
            //this.loggedIn.next(true)

            return true
        }

        return false
    }

    public getAccessToken() {
        //return localStorage.getItem(this.ACCESS_TOKEN);

        return this.accessToken
    }

    public invalidRefreshToken() {
        this.doLogoutUser()
    }

    private startRefreshTokenTimer() {
        //Refresh access token before it expires as the backend has it valid for 15 minutes thus refresh it each 14 minutes meanning a minute before token expires
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), 14 * 60 * 1000)
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout)
    }

    private storeAccessToken(accessToken: string) {
        //localStorage.setItem(this.ACCESS_TOKEN, access_token);

        this.accessToken = accessToken
    }

    /*private getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN);
    }
    */

    private doLogoutUser() {
        this.loggedUsername = null
        this.loggedIn.next(false)
        this.removeTokens()
    }

    private removeTokens() {
        //localStorage.removeItem(this.ACCESS_TOKEN);
        //localStorage.removeItem(this.REFRESH_TOKEN);
        this.accessToken = null
        this.redirectToLoginPage()
    }

    private redirectToLoginPage() {
        this.router.navigate(['/login'])
    }

    private doLoginUser(tokens: Tokens) {
        this.storeTokens(tokens)
    }

    private storeTokens(tokens: Tokens) {
        //localStorage.setItem(this.ACCESS_TOKEN, tokens.access_token);
        //localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);

        this.accessToken = tokens.accessToken
    }
}
