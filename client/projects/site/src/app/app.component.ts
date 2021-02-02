import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'site';

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  constructor(private authService: AuthService) {}

  username: string

  userIsAuthenticated() {
    this.authService.authenticatedUser().pipe(
      map(async (username: string | null) => {
        //this.username = username

        console.log('Authenticated')
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  ngOnInit() {
    //this.userIsAuthenticated()

    this.authService.isLoggedIn()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }
}
