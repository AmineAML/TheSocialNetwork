import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

class CustormValidators {
  static passwordContainsNumber(control: AbstractControl): ValidationErrors {
    const regex = /\d/

    if (regex.test(control.value) && control.value !== null) {
      return null
    } else {
      return {
        passwordInvalid: true
      }
    }
  }

  static passwordMatch(control: AbstractControl): ValidationErrors {
    const password = control.get('password').value
    const confirm_password = control.get('confirm_password').value

    if ((password !== null && confirm_password !== null) && (password == confirm_password)) {
      return null
    } else {
      return {
        passwordNotMatching: true
      }
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup

  //Handle unsubscriptions
  private ngUnsubscribe = new Subject()

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router
              /*private route: ActivatedRoute*/) { }
  
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: [null, [
        Validators.required
      ]],
      email: [null, [
        Validators.required,
        Validators.email,
        Validators.minLength(6)
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(3),
        //Verify password contains a number, better verify it does contain a number and an uppercase character and symbols, also don't specify this and make it to register
        //CustormValidators.passwordContainsNumber
      ]],
      confirm_password: [null, [
        Validators.required
      ]]
    }, {
      validators: CustormValidators.passwordMatch
    })

    // this.form = this.fb.group({
    //   username: ['', Validators.required],
    //   email: ['', Validators.email],
    //   password: ['', Validators.required],
    //   confirm_password: ['', Validators.required]
    // });

    /*if (await this.authService.checkAuthenticated()) {
      await this.router.navigate([this.returnUrl]);
    }
    */
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value).pipe(
      //map(user => this.router.navigate(['edit-profile'])),
      takeUntil(this.ngUnsubscribe)
    ).subscribe()
  };
  
  // usernameFormControl = new FormControl('', [
  //   //Validators.required,
  //   Validators.required,
  // ]);

  // emailFormControl = new FormControl('', [
  //   //Validators.required,
  //   Validators.email,
  // ]);

  // confirmPasswordFormControl = new FormControl('', [
  //   Validators.required,
  // ]);
  
  // passwordFormControl = new FormControl('', [
  //   Validators.required,
  // ]);
  
  // registerForm = new FormGroup({
  //   username: new FormControl(''),
  //   email: this.emailFormControl,
  //   password: new FormControl(''),
  //   confirm_password: new FormControl('')
  // });

  // submitFormPressedNotifyErrors = false;

  // isRequired = false;

  //Check if the input are fieled, don't submit if any of the inputs aren't filled
  // onSubmit() {
  //   if (!this.registerForm.value.username ||!this.registerForm.value.email || !this.registerForm.value.password) {
  //     //Display an error popup about submission
  //     this.usernameFormControl;
  //     this.emailFormControl;
  //     this.passwordFormControl;
  //     this.confirmPasswordFormControl;
  //     this.submitFormPressedNotifyErrors = true;
  //     this.isRequired = true
  //   }
  //   else {
  //     const username = this.registerForm.value.username;
  //     const email = this.registerForm.value.email;
  //     const password = this.registerForm.value.password;
  //     console.log(username)
  //     console.log(email)
  //     console.log(password)
  //     // this.authService.signup(username, email, password).subscribe(data => console.log(data))
  //   }
  // };

  // email = new FormControl('', [Validators.required, Validators.email]);

  // hide = true;

  // form: FormGroup;
  // public loginInvalid: boolean;
  // private formSubmitAttempt: boolean;
  // private returnUrl: string;

  // getErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     return 'You must enter a value';
  //   }

  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }

  // ngOnInit(): void {
  //   this.form = this.fb.group({
  //     username: ['', Validators.required],
  //     email: ['', Validators.email],
  //     password: ['', Validators.required],
  //     confirm_password: ['', Validators.required]
  //   });

  //   /*if (await this.authService.checkAuthenticated()) {
  //     await this.router.navigate([this.returnUrl]);
  //   }
  //   */
  // }

  ngOnDestroy() {
    this.ngUnsubscribe.next()

    this.ngUnsubscribe.complete()
  }
}
