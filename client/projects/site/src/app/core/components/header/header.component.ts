import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { Observable, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { MessageSnackBarComponent } from '../../../shared/components/message-snack-bar/message-snack-bar.component'
import { Userss } from '../../../shared/models'
import { AuthService } from '../../services/auth.service'
import { DataService } from '../../services/data.service'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    loggedIn = false

    faCaretDown = faCaretDown

    user: string

    username: string

    profile$: Observable<Userss>

    //Handle unsubscriptions
    private ngUnsubscribe$ = new Subject()

    constructor(
        private authService: AuthService,
        private router: Router,
        private dataService: DataService,
        private snackBar: MatSnackBar
    ) {}

    getUser() {
        this.authService
            .authenticatedUser()
            .pipe(
                map(async (username: string | null) => {
                    this.username = username

                    this.getUserProfile()

                    this.authService.loggedUsername = this.username
                }),
                takeUntil(this.ngUnsubscribe$)
            )
            .subscribe()
    }

    getUserProfile() {
        this.profile$ = this.dataService.findByUsername(this.username).pipe(
            map((userData: Userss) => {
                this.authService.loggedUsername = userData.user.username

                this.authService.setLoggedInUsername(true)

                if (userData.user.is_confirmed) {
                    this.authService.setConfirmedEmailLink(true)
                } else {
                    this.authService.setConfirmedEmailLink(false)
                }

                return userData
            })
        )
    }

    isAuthenicated() {
        this.authService
            .loginStatusChange()
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(async loggedIn => {
                if (loggedIn) {
                    this.getUser()
                } else {
                    this.username = null

                    this.profile$ = null
                }
            })
    }

    editedAvatarLink() {
        this.authService
            .getAvatarLink()
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((value: boolean) => {
                if (value) {
                    this.getUserProfile()
                }
            })
    }

    logout() {
        this.authService.logout().pipe(takeUntil(this.ngUnsubscribe$)).subscribe()

        this.profile$ = null

        this.router.navigate(['/'])

        this.snackBar.openFromComponent(MessageSnackBarComponent, {
            duration: 7000,
            data: {
                message: "You've been logged out",
                hasError: false
            },
            horizontalPosition: 'end',
            verticalPosition: 'top'
        })
    }

    async ngOnInit(): Promise<void> {
        this.isAuthenicated()

        this.editedAvatarLink()
    }

    ngOnDestroy() {
        this.ngUnsubscribe$.next()

        this.ngUnsubscribe$.complete()
    }
}
