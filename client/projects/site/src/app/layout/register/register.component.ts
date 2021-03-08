import { Component, OnDestroy, OnInit } from '@angular/core'
import {
    Validators,
    FormGroup,
    FormBuilder,
    AbstractControl,
    ValidationErrors
} from '@angular/forms'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { AuthService } from '../../core/services/auth.service'

class CustomValidators {
    // static passwordContainsNumber(control: AbstractControl): ValidationErrors {
    //   const regex = /\d/

    //   if (regex.test(control.value) && control.value !== null) {
    //     return null
    //   } else {
    //     return {
    //       passwordInvalid: true
    //     }
    //   }
    // }

    static passwordMatch(control: AbstractControl): ValidationErrors {
        const password = control.get('password').value
        const confirmPassword = control.get('confirm_password').value

        if (password !== null && confirmPassword !== null && password === confirmPassword) {
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

    constructor(private formBuilder: FormBuilder, private authService: AuthService) {}

    onSubmit() {
        if (this.registerForm.invalid) {
            return
        }

        this.authService
            .register(this.registerForm.value)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe()
    }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group(
            {
                username: [null, [Validators.required]],
                email: [null, [Validators.required, Validators.email, Validators.minLength(6)]],
                password: [
                    null,
                    [
                        Validators.required,
                        Validators.minLength(3)
                        //Verify password contains a number, better verify it does contain a number and an uppercase character and symbols, also don't specify this and make it to register
                        //CustormValidators.passwordContainsNumber
                    ]
                ],
                // eslint-disable-next-line @typescript-eslint/naming-convention
                confirm_password: [null, [Validators.required]]
            },
            {
                validators: CustomValidators.passwordMatch
            }
        )
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()

        this.ngUnsubscribe.complete()
    }
}
