import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('', [
    //Validators.required,
    Validators.email,
  ]);

  emailFormControl2 = new FormControl('', [
    Validators.required,
    //Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
  ]);

  loginForm = new FormGroup({
    email: this.emailFormControl,
    password: new FormControl('')
  });

  submitFormPressedNotifyErrors = false;

  isRequired = false;

  //Check if the input are fieled, don't submit if any of the inputs aren't filled
  onSubmit() {
    if (!this.loginForm.value.email || !this.loginForm.value.password) {
      //Display an error popup about submission
      this.emailFormControl2;
      this.passwordFormControl;
      this.submitFormPressedNotifyErrors = true;
      this.isRequired = true
    }
    else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      console.log(email)
      console.log(password)
      this.authService.login(email, password).subscribe(data => console.log(data))
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

  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });

    /*if (await this.authService.checkAuthenticated()) {
      await this.router.navigate([this.returnUrl]);
    }
    */
  }

}
