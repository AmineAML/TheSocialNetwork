import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-email-confirmed',
  templateUrl: './email-confirmed.component.html',
  styleUrls: ['./email-confirmed.component.scss']
})
export class EmailConfirmedComponent implements OnInit, OnDestroy {
  link: string

  isEmailConfirmed: boolean

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  isServerRespondedWithData: Promise<boolean>

  constructor(private dataService: DataService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) { }

  async confirmEmail() {
    this.dataService.confirmEmailByLink(this.link).pipe(
      //Display data into console log
      //tap(users => console.log('ree' + users)),
      map((value) => {
        console.log(value)
        
        if (value) {
          this.isEmailConfirmed = true

          console.log('Email confirmed')

          this.authService.setConfirmedEmailLink(true);
        }

        this.isServerRespondedWithData = Promise.resolve(true)
      }),
      catchError(async (err) => {
        console.log(err)

        if (err instanceof HttpErrorResponse && err.status === 404) {
          console.log("Email not confirmed")

          this.isEmailConfirmed = false
        }

        this.isServerRespondedWithData = Promise.resolve(true)
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()

    //console.log(this.dataSource)

    //setTimeout(() => console.log(this.dataSource), 7000)

    //console.log(this.username)
  }

  async ngOnInit(): Promise<void> {
    this.link = this.activatedRoute.snapshot.paramMap.get('link')

    console.log(`Link ${this.link}`)

    if (this.link) {
      await this.confirmEmail()
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }
}
