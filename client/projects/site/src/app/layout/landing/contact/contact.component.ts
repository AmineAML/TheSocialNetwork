import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Validators, FormGroup, FormBuilder } from '@angular/forms'
import { ContactForm } from '../../../shared/models'

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
    @Output() submitEmail = new EventEmitter<ContactForm>()

    contactForm: FormGroup

    originalContactFormValue: any

    constructor(private formBuilder: FormBuilder) {}

    sendEmail() {
        this.submitEmail.emit(this.contactForm.getRawValue())
    }

    ngOnInit() {
        this.contactForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            subject: ['', [Validators.required]],
            message: ['', [Validators.required]]
        })

        /*
      Difference between this.contactForm.getRawValue() vs this.contactForm.value
        this.contactForm.getRawValue() does get this values initialized on the FormBuilder (in this case: null)
        this.contactForm.value doesn't get the values initialized on the FormBuilder (in this case it does set the values as: "")

      Why this.contactForm.getRawValue() is better?
        because resetting the form value after a successful data submit does set the values as null
      
      Thus this works better preventing the user from not saving their form data by comparing both initial values and values that were reset
    */
        this.originalContactFormValue = this.contactForm.getRawValue() //.value;
    }
}
