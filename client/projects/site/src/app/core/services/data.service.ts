import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

export interface UserData {
  message: string,
  data: {
    users: User[],
    meta: Meta,
    link: Link
  },
  errors: any
}

export interface UserProfileData {
  message: string,
  data: {
    user: User,
    meta: Meta,
    link: Link
  },
  errors: any
}

export interface ImageData {
  message: string,
  data: {
    images: Image[]
  },
  errors: any
}

export interface InterestData {
  message: string,
  data: {
    interests: Interest[]
  },
  errors: any
}

export interface Interest {
  name: string,
  byNumberOfUsers: number,
  createdAt: Date,
  updatedAt: Date,
  id: string
}

export interface Image {
  link: string,
  type: string,
  user_id: string,
  createdAt: Date,
  updatedAt: Date,
  id: string
}

export interface User {
  username?: string
  email?: string
  interest?: Array<string>
  first_name?: string
  last_name?: string
  description?: string
  gender?: string
  role?: string
  social_media?: SocialMedia
  is_confirmed?: boolean
  createdAt?: Date
  updatedAt?: Date
  id?: string
}

export interface SocialMedia {
  facebook: string
  linkedin: string
  twitter: string
  tiktok: string
  discord: string
  instagram: string
  youtube: string
}

export interface Meta {
  itemCount: number
  totalItems: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}

export interface Link {
  first: string
  previous: string
  next: string
  last: string
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  findByQuery(query: string, page: number, size: number): Observable</*UserData*/any> {
    let params = new HttpParams()

    params = params.append('search_term', String(query))

    params = params.append('page', String(page))
    
    params = params.append('limit', String(size))

    return /*const ree = */this.http.get('/api/v1/users/query', { params }).pipe(
      //tap(users => console.log(users)),
      mergeMap((resultFromRequest1: UserData) => this.findAllImagesByUsersIds(resultFromRequest1.data.users).pipe(
        tap(imgs => console.log(`Avatars and backgrounds: ${imgs}`)),
        map((resultFromRequest2: ImageData) => {
          // use resultFromRequest1 or 2
          const users = resultFromRequest1.data.users.map(user => ({
            ...user,
            image: resultFromRequest2.data.images.filter(
              image => image.user_id === user.id
            )
          }))

          return {
            users,
            link: resultFromRequest1.data.link,
            meta: resultFromRequest1.data.meta
          }
          
          /*&& resultFromRequest1.data.meta && resultFromRequest1.data.link*/

          /*const mergeById = ([t, s]) => t.map(p => Object.assign({}, p, s.find(q => p.id === q.id)));

          const all$ = combineLatest(resultFromRequest1.data.users, resultFromRequest2.data.images).pipe(
            map(mergeById)
          );
          */
        }))
      ),
      catchError(err => throwError(err))
    );

    //console.log(`Multiple observables: ${ree}`)

    //return ree

    /*return this.http.get('/api/v1/users/query', { params }).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )
    */
  }

  findByUsername(username: string): Observable</*UserData*/any> {
    return this.http.get(`/api/v1/users/user/username/${username}`).pipe(
      //tap(users => console.log(users)),
      mergeMap((resultFromRequest1: UserProfileData) => this.findAllImagesByUsersIds(resultFromRequest1.data.user).pipe(
        tap(imgs => console.log(`Avatars and backgrounds: ${imgs}`)),
        map((resultFromRequest2: ImageData) => {
          // use resultFromRequest1 or 2
          const user = {
            ...resultFromRequest1.data.user,
            image: resultFromRequest2.data.images
          }

          return {
            user,
            link: resultFromRequest1.data.link,
            meta: resultFromRequest1.data.meta
          }
          
          /*&& resultFromRequest1.data.meta && resultFromRequest1.data.link*/

          /*const mergeById = ([t, s]) => t.map(p => Object.assign({}, p, s.find(q => p.id === q.id)));

          const all$ = combineLatest(resultFromRequest1.data.users, resultFromRequest2.data.images).pipe(
            map(mergeById)
          );
          */
        }))
      ),
      catchError(err => throwError(err))
    );

    // return this.http.get(`/api/v1/users/user/username/${username}`).pipe(
    //   map((userData: UserData) => userData),
    //   catchError(err => throwError(err))
    // )
  }

  findAllImagesByUsersIds(users: User | User[]): Observable<ImageData> {
    console.log(`Images by users ids profiles: ${users}`)

    let payload = new HttpParams()

    const ree = ['5ffcc281a9d5d2436829b0f1', '6008595eee009f4c985b2b1d']

    if (Array.isArray(users)) {
      users.forEach(user => {
        payload = payload.append('usersIds', user.id)
  
        console.log(user.id)
      })
    } else {
      payload = payload.append('usersIds', users.id)
    }

    console.log(`Paload: ${payload}`)
    
    return this.http.post(`/api/v1/images/images`, payload).pipe(
      map((imageData: ImageData) => imageData),
      catchError(err => throwError(err))
    )
  }

  findImagesByUsersIds(users_ids: Array<string>): Observable<ImageData> {
    let payload = new HttpParams()

    users_ids.forEach(user_id => {
      payload.append('usersIds', user_id)
    })
    return this.http.get(`/api/v1/images/images`).pipe(
      map((imageData: ImageData) => imageData),
      catchError(err => throwError(err))
    )
  }

  findImagesByUserId(user_id: string): Observable<ImageData> {
    return this.http.get(`/api/v1/images/image/${user_id}`).pipe(
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
}
