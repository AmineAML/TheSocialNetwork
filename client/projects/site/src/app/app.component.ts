import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'site';

  constructor(private authService: AuthService) {}

  username: string

  userIsAuthenticated() {
    this.authService.authenticatedUser().pipe(
      map(async (username: string | null) => {
        //this.username = username

        console.log('Authenticated')
      })
    ).subscribe()
  }

  ngOnInit() {
    //this.userIsAuthenticated()

    this.authService.isLoggedIn()
  }
}
