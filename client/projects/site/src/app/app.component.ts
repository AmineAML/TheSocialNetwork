import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  constructor(private authService: AuthService) {}

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
