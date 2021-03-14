import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../../core/services/auth.service'
import { catchError, map, takeUntil } from 'rxjs/operators'
import { of, Subject } from 'rxjs'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup

    unauthorizedCredentialsError: boolean

    //Handle unsubscriptions
    private ngUnsubscribe = new Subject()

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        if (this.loginForm.invalid) {
            return
        }

        this.authService
            .login(this.loginForm.value)
            .pipe(
                map(tokens => {
                    if (tokens) {
                        this.router.navigate(['/'])
                    } else {
                        this.unauthorizedCredentialsError = true
                    }
                }),
                catchError(error => of(false)),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe()
    }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
                Validators.minLength(6)
            ]),
            password: new FormControl(null, [Validators.required, Validators.minLength(3)])
        })
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()

        this.ngUnsubscribe.complete()
    }
}
