import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { ComponentCanDeactivate } from '../../core/guards/form-can-deactivate.guard';
import { DataService } from '../../core/services/data.service';
import { MessageSnackBarComponent } from '../../shared/components/message-snack-bar/message-snack-bar.component';
import { InterestData } from '../../shared/models';
import { ContactComponent } from './contact/contact.component';

export interface Interest {
  name: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements ComponentCanDeactivate {
  @ViewChild(ContactComponent) contactComponent: ContactComponent

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  interests$: Observable<Interest[]>

  isServerRespondedWithData: Promise<boolean>

  isContactUsEmailSent: boolean

  constructor(private router: Router, private dataService: DataService, private snackBar: MatSnackBar) {
    this.interests$ = this.dataService.findAllInterestsSorted().pipe(
      map((interestData: InterestData) => {
        let interestsArray: Interest[] = []

        interestData.data.interests.forEach(interest => {
          interestsArray.push(
            { name: interest.name }
          )
        })

        return interestsArray
      })
    )
  }

  getUsers(query: string) {
    this.router.navigate(['search'], { queryParams: { interest: query } })
  }

  submitContactEmail(contactFormValue) {
    this.dataService.sendContactEmail(contactFormValue).pipe(
      map(sent => {
        this.isContactUsEmailSent = true
  
        this.snackBar.openFromComponent(MessageSnackBarComponent, {
          duration: 7000,
          data: {
            message: "You message is sent",
            hasError: false
          }
        })
  
        this.contactComponent.contactForm.reset(this.contactComponent.originalContactFormValue)
      }),
      catchError(async (err) => {
        // console.log(err)

        this.isContactUsEmailSent = false

        this.snackBar.openFromComponent(MessageSnackBarComponent, {
          duration: 7000,
          data: {
            message: "We couldn't send your message",
            hasError: true
          }
        })
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      error: (err: Error): void => {
        console.error('LandingComponent#subscribe#error', err)
      }
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }

  //Handles warning on unsaved form on refresh page
  @HostListener("window:beforeunload")
  //Handles warning on unsaved form on routing
  canDeactivate() {
    //Compare initial form value with its value on navigation
    return !(JSON.stringify(this.contactComponent.originalContactFormValue) !== JSON.stringify(this.contactComponent.contactForm.getRawValue()));
  }
}
