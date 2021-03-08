import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    email = new FormControl('', [Validators.required, Validators.email])

    hide = true

    form: FormGroup
    public loginInvalid: boolean
    private formSubmitAttempt: boolean
    private returnUrl: string

    constructor(
        private fb: FormBuilder
    ) /*private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService*/ {}

    getErrorMessage() {
        if (this.email.hasError('required')) {
            return 'You must enter a value'
        }

        return this.email.hasError('email') ? 'Not a valid email' : ''
    }

    async onSubmit() {
        this.loginInvalid = false
        this.formSubmitAttempt = false
        if (this.form.valid) {
            try {
                const username = this.form.get('username').value
                const password = this.form.get('password').value
                //await this.authService.login(username, password);
            } catch (err) {
                this.loginInvalid = true
            }
        } else {
            this.formSubmitAttempt = true
        }
    }

    async ngOnInit(): Promise<void> {
        this.form = this.fb.group({
            username: ['', Validators.email],
            password: ['', Validators.required]
        })

        /*if (await this.authService.checkAuthenticated()) {
      await this.router.navigate([this.returnUrl]);
    }
    */
    }
}
