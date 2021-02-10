import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { DataService } from '../../../core/services/data.service';
import { MessageSnackBarComponent } from '../../../shared/components/message-snack-bar/message-snack-bar.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  contactForm: FormGroup

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  isContactUsEmailSent: boolean

  constructor(private formBuilder: FormBuilder,
              private dataService: DataService,
              private snackBar: MatSnackBar) { }

  submitContactEmail() {
    this.dataService.sendContactEmail(this.contactForm.getRawValue()).pipe(
      map((value) => {
        console.log(value)
        
        if (value) {
          this.isContactUsEmailSent = true

          this.snackBar.openFromComponent(MessageSnackBarComponent, {
            duration: 7000,
            data: {
              message: "You message is sent",
              hasError: false
            }
          })

          this.contactForm.reset()
        }
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
    ).subscribe()
  }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      subject: [null, [Validators.required]],
      message: [null, [Validators.required]]
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }
}
