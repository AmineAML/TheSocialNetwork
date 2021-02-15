import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { CanDeactivateState } from './core/guards/form-can-deactivate.guard';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  constructor(private authService: AuthService,
              private router: Router) {
    // Clicks the back button, ask the CanDeactivateGuard to defend against this.
    window.onpopstate = () => CanDeactivateState.defendAgainstBrowserBackButton = true;

    // Successful navigation, CanDeactivateGuard shouldn't defends against back button clicks
    router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      tap(() => CanDeactivateState.defendAgainstBrowserBackButton = false)  
    ).subscribe();
  }

  username: string

  emailNotConfirmedComponentRemove: boolean = true

  close(action: string) {
    if (action === 'close') {
      this.emailNotConfirmedComponentRemove = false
    }
  }

  ngOnInit() {
    this.authService.isLoggedIn()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }
}
