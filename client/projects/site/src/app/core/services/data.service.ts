import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { catchError, map, mapTo, mergeMap, tap } from 'rxjs/operators'
import {
    ContactForm,
    ImageData,
    InterestData,
    PasswordForm,
    ReportForm,
    User,
    UserData,
    UserProfileData
} from '../../shared/models'

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private http: HttpClient) {}

    findByQuery(query: string, page: number, size: number): Observable<any> {
        let params = new HttpParams()

        params = params.append('search_term', String(query))

        params = params.append('page', String(page))

        params = params.append('limit', String(size))

        return this.http.get('/api/v1/users/query', { params }).pipe(
            //tap(users => console.log(users)),
            mergeMap((resultFromRequest1: UserData) =>
                this.findAllImagesByUsersIds(resultFromRequest1.data.users).pipe(
                    map((resultFromRequest2: ImageData) => {
                        // use resultFromRequest1 or 2

                        let users = null

                        let res: any

                        if (resultFromRequest1.data.users !== null) {
                            if (resultFromRequest2.data.images !== null) {
                                users = resultFromRequest1.data.users.map(user => ({
                                    ...user,
                                    image: resultFromRequest2.data.images.filter(
                                        image => image.user_id === user.id
                                    )
                                }))
                            } else {
                                users = resultFromRequest1.data.users.map(user => ({
                                    ...user,
                                    image: null
                                }))
                            }

                            res = {
                                users,
                                link: resultFromRequest1.data.link,
                                meta: resultFromRequest1.data.meta
                            }
                        } else {
                            res = {
                                users,
                                link: null,
                                meta: null
                            }
                        }

                        return res
                    })
                )
            ),
            catchError(err => throwError(err))
        )
    }

    findByUsername(username: string): Observable<any> {
        return this.http.get(`/api/v1/users/user/username/${username}`).pipe(
            //tap(users => console.log(users)),
            mergeMap((resultFromRequest1: UserProfileData) =>
                this.findAllImagesByUsersIds(resultFromRequest1.data.user).pipe(
                    // tap(imgs => {
                    //   console.log(imgs)
                    // }),
                    map((resultFromRequest2: ImageData) => {
                        // use resultFromRequest1 or 2

                        let user = null

                        let res: any

                        if (resultFromRequest1.data.user !== null) {
                            if (resultFromRequest2.data.images !== null) {
                                user = {
                                    ...resultFromRequest1.data.user,
                                    image: resultFromRequest2.data.images
                                }
                            } else {
                                user = {
                                    ...resultFromRequest1.data.user,
                                    image: null
                                }
                            }

                            res = {
                                user,
                                link: resultFromRequest1.data.link,
                                meta: resultFromRequest1.data.meta
                            }
                        } else {
                            res = {
                                user,
                                link: null,
                                meta: null
                            }
                        }

                        return res
                    })
                )
            ),
            catchError(err => throwError(err))
        )
    }

    //This is specific for interests comparaison from the profile route without requesting avatar and background images
    findByUsernameData(username: string): Observable<any> {
        return this.http.get(`/api/v1/users/user/username/${username}`).pipe(
            map((userData: UserProfileData) => userData),
            catchError(err => throwError(err))
        )
    }

    findAllImagesByUsersIds(users: User | User[]): Observable<ImageData> {
        if (users !== null) {
            let payload = new HttpParams()

            if (Array.isArray(users)) {
                users.forEach(user => {
                    payload = payload.append('usersIds', user.id)
                })
            } else {
                payload = payload.append('usersIds', users.id)
            }

            return this.http.post(`/api/v1/images/images`, payload).pipe(
                map((imageData: ImageData) => imageData),
                catchError(err => throwError(err))
            )
        } else {
            let noneImageData: ImageData
            return of(noneImageData)
        }
    }

    findImagesByUsersIds(usersIds: Array<string>): Observable<ImageData> {
        const payload = new HttpParams()

        usersIds.forEach(userId => {
            payload.append('usersIds', userId)
        })
        return this.http.get(`/api/v1/images/images`).pipe(
            map((imageData: ImageData) => imageData),
            catchError(err => throwError(err))
        )
    }

    findImagesByUserId(userId: string): Observable<ImageData> {
        return this.http.get(`/api/v1/images/image/${userId}`).pipe(
            map((imageData: ImageData) => imageData),
            catchError(err => throwError(err))
        )
    }

    findAllInterestsSorted(): Observable<InterestData> {
        return this.http.get('/api/v1/users/interests').pipe(
            map((interestData: InterestData) => interestData),
            catchError(err => throwError(err))
        )
    }

    updateUser(user): Observable<User> {
        return this.http.put(`/api/v1/users/user/${user.id}`, user)
    }

    uploadProfileAvatar(formData: FormData): Observable<any> {
        return this.http.post<FormData>('/api/v1/images/image/upload', formData, {
            reportProgress: true,
            observe: 'events'
        })
    }

    confirmEmailByLink(link: string): Observable<any> {
        return this.http.get(`/api/v1/users/confirm/${link}`).pipe(
            map(isEmailConfirmed => {
                // Email confirmed
                console.log(isEmailConfirmed)
                return true
            }),
            // Email not confirmed
            catchError(err => {
                if (err instanceof HttpErrorResponse && err.status === 404) {
                    //console.log("Email not confirmed")
                    return throwError(err)
                } else {
                    return throwError(err)
                }
            })
        )
    }

    resendEmailConfirmationLink(): Observable<User> {
        return this.http.put('/api/v1/users/user/confirm/email', {}).pipe(
            tap(
                confirmationEmailSent =>
                    //console.log(confirmationEmailSent)

                    true
            ),
            catchError(error => throwError(error))
        )
    }

    reportUserProfile(reportForm: ReportForm) {
        return this.http.post<any>('/api/v1/reports/report', reportForm).pipe(
            tap(reporting => {
                console.log(reporting)
            }),
            mapTo(true),
            catchError(error => {
                const err = JSON.stringify(error.error.errors)
                alert(err)
                return of(false)
            })
        )
    }

    sendContactEmail(contactForm: ContactForm) {
        return this.http
            .post<any>('/api/v1/mailer/contact', contactForm)
            .pipe(catchError(error => throwError(error)))
    }

    changePassword(passwordForm: PasswordForm) {
        return this.http.put<any>('/api/v1/users/user/change/password', passwordForm).pipe(
            tap(passwordModified => true),
            catchError(error => throwError(error))
        )
    }
}
