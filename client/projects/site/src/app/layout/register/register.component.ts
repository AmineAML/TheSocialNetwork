import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  usernameFormControl = new FormControl('', [
    //Validators.required,
    Validators.required,
  ]);

  emailFormControl = new FormControl('', [
    //Validators.required,
    Validators.email,
  ]);

  confirmPasswordFormControl = new FormControl('', [
    Validators.required,
  ]);
  
  passwordFormControl = new FormControl('', [
    Validators.required,
  ]);
  
  registerForm = new FormGroup({
    username: new FormControl(''),
    email: this.emailFormControl,
    password: new FormControl(''),
    confirm_password: new FormControl('')
  });

  submitFormPressedNotifyErrors = false;

  isRequired = false;

  //Check if the input are fieled, don't submit if any of the inputs aren't filled
  onSubmit() {
    if (!this.registerForm.value.username ||!this.registerForm.value.email || !this.registerForm.value.password) {
      //Display an error popup about submission
      this.usernameFormControl;
      this.emailFormControl;
      this.passwordFormControl;
      this.confirmPasswordFormControl;
      this.submitFormPressedNotifyErrors = true;
      this.isRequired = true
    }
    else {
      const username = this.registerForm.value.username;
      const email = this.registerForm.value.email;
      const password = this.registerForm.value.password;
      console.log(username)
      console.log(email)
      console.log(password)
      // this.authService.signup(username, email, password).subscribe(data => console.log(data))
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
      username: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });

    /*if (await this.authService.checkAuthenticated()) {
      await this.router.navigate([this.returnUrl]);
    }
    */
  }

}
