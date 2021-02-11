import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Userss } from '../../../shared/types';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-email-not-confirmed',
  templateUrl: './email-not-confirmed.component.html',
  styleUrls: ['./email-not-confirmed.component.scss']
})
export class EmailNotConfirmedComponent implements OnInit, OnDestroy {
  @Output() closeComponent = new EventEmitter()

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  notConfirmedEmail: boolean = false

  isServerRespondedWithData: Promise<boolean>

  username: string

  constructor(private authService: AuthService,
              private dataService: DataService) { }

  close() {
    this.closeComponent.emit('close')
  }

  isAuthenicated() {
    this.authService.loginStatusChange().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(async loggedIn => {
      if (loggedIn) {
        await this.getUser()
      } else {
        this.isServerRespondedWithData = Promise.resolve(false)
      }
    });
  }

  async getUserProfile() {
    this.dataService.findByUsername(this.username).pipe(
      map((userData: Userss) => {
        this.isServerRespondedWithData = Promise.resolve(true)

        if (userData.user.is_confirmed) {
          this.notConfirmedEmail = true
        }

        //console.log(userData)
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  async getUser() {
    this.authService.authenticatedUser().pipe(
      map(async (username: string | null) => {
        this.username = username
        
        await this.getUserProfile()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  }

  confirmedEmailLink() {
    this.authService.getConfirmedEmailLink().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((value: boolean) => {
      if (value) {
        this.getUserProfile()
      }
    })
  }

  ngOnInit(): void {
    this.isAuthenicated()

    this.confirmedEmailLink()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()

    this.authService.setConfirmedEmailLink(false)
  }
}
