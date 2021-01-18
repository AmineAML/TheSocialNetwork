import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  nameFormControl = new FormControl('', [
    //Validators.required,
    Validators.required,
  ]);

  emailFormControl = new FormControl('', [
    //Validators.required,
    Validators.email,
  ]);

  subjectFormControl = new FormControl('', [
    //Validators.required,
    Validators.required,
  ]);

  messageFormControl = new FormControl('', [
    //Validators.required,
    Validators.required,
  ]);
  
  contactForm = new FormGroup({
    name: new FormControl(''),
    email: this.emailFormControl,
    subject: new FormControl(''),
    message: new FormControl(''),
  });

  submitFormPressedNotifyErrors = false;

  isRequired = false;

  //Check if the input are fieled, don't submit if any of the inputs aren't filled
  onSubmit() {
    if (!this.contactForm.value.name ||!this.contactForm.value.email || !this.contactForm.value.subject || !this.contactForm.value.message) {
      //Display an error popup about submission
      this.nameFormControl;
      this.emailFormControl;
      this.subjectFormControl;
      this.messageFormControl;
      this.submitFormPressedNotifyErrors = true;
      this.isRequired = true
    }
    else {
      const name = this.contactForm.value.username;
      const email = this.contactForm.value.email;
      const subject = this.contactForm.value.username;
      const message = this.contactForm.value.username;
      console.log(name)
      console.log(email)
      console.log(subject)
      console.log(message)
      // this.authService.contact(name, email, subject, message).subscribe(data => console.log(data))
    }
  };

  email = new FormControl('', [Validators.required, Validators.email]);

  hide = true;

  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;
  private returnUrl: string;

  constructor(private fb: FormBuilder,
    private authService: AuthService
              /*private route: ActivatedRoute,
              private router: Router,*/) { }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });

    /*if (await this.authService.checkAuthenticated()) {
      await this.router.navigate([this.returnUrl]);
    }
    */
  }

}
