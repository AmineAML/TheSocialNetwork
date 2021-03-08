import { Injectable } from '@angular/core'
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { catchError, filter, switchMap, take } from 'rxjs/operators'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (this.authService.getAccessToken()) {
            request = this.addToken(request, this.authService.getAccessToken())
        }

        return next.handle(request).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    //console.log('UnAuthorized')
                    return this.handle401Error(request, next)
                } else {
                    return throwError(error)
                }
            })
        )
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                authorization: `Bearer ${token}`
            }
        })
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true
            this.refreshTokenSubject.next(null)

            return this.authService.refreshToken().pipe(
                switchMap((token: any) => {
                    this.isRefreshing = false
                    this.refreshTokenSubject.next(token.data.access_token)
                    return next.handle(this.addToken(request, token.data.access_token))
                }),
                catchError(err => {
                    if (err instanceof HttpErrorResponse && err.status === 401) {
                        console.log('Refresh token UnAuthorized')
                        this.authService.invalidRefreshToken()
                        return next.handle(request)
                    } else {
                        return throwError(err)
                    }
                })
            )
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(accessToken => next.handle(this.addToken(request, accessToken)))
            )
        }
    }
}
