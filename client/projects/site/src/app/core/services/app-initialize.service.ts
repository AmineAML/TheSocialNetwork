import { Injectable } from '@angular/core'
import { AuthService } from './auth.service'

@Injectable({
    providedIn: 'root'
})
export class AppInitializeService {
    constructor(private authService: AuthService) {}

    init() {
        return new Promise<void>(resolve => {
            // attempt to refresh token on app start up to auto authenticate
            // if (!this.authService.isLoggedIn()) {
            //   resolve()

            //   return;
            // }

            //console.log('Refresh token')

            this.authService.refreshToken().subscribe().add(resolve)
        })
    }
}
