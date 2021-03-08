import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { CanDeactivateState } from './core/guards/form-can-deactivate.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router) {
    // Clicks the back button, ask the CanDeactivateGuard to defend against this.
    window.onpopstate = () => CanDeactivateState.defendAgainstBrowserBackButton = true;

    // Successful navigation, CanDeactivateGuard shouldn't defends against back button clicks
    router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      tap(() => CanDeactivateState.defendAgainstBrowserBackButton = false)  
    ).subscribe();
  }

  emailNotConfirmedComponentRemove: boolean = true

  close(action: string) {
    if (action === 'close') {
      this.emailNotConfirmedComponentRemove = false
    }
  }
}
