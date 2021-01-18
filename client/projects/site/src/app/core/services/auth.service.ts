import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<any>('/api/v1/users/login', { email, password }).pipe(
      map((data) => {
        console.log(data.data.access_token)
        localStorage.setItem('the-social-network', data.data.access_token)
        return data
      })
    )
  }
}
