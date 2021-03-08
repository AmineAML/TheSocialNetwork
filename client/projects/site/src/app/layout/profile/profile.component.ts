import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import {
    faFacebook,
    faLinkedin,
    faTwitter,
    faTiktok,
    faDiscord,
    faInstagram,
    faYoutube
} from '@fortawesome/free-brands-svg-icons'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { Observable, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { DialogReportComponent } from '../../core/components/dialog-report/dialog-report.component'
import { AuthService } from '../../core/services/auth.service'
import { DataService } from '../../core/services/data.service'
import { UserProfileData, Userss } from '../../shared/models'

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    faFacebook = faFacebook
    faLinkedin = faLinkedin
    faTwitter = faTwitter
    faTiktok = faTiktok
    faDiscord = faDiscord
    faInstagram = faInstagram
    faYoutube = faYoutube
    faEllipsisH = faEllipsisH

    username: string

    profile$: Observable<Userss>

    similarInterests$: Observable<number>

    //Handle unsubscriptions
    private ngUnsubscribe$ = new Subject()

    constructor(
        private dataService: DataService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private authService: AuthService
    ) {}

    getUser() {
        this.profile$ = this.dataService.findByUsername(this.username).pipe(
            map((userData: Userss) => {
                if (userData.user !== null) {
                    this.getAuthenticatedUser(userData)
                }

                return userData
            })
        )
    }

    getAuthenticatedUser(user: Userss) {
        this.similarInterests$ = this.dataService
            .findByUsernameData(this.authService.loggedUsername)
            .pipe(
                map((userData: UserProfileData) => {
                    if (
                        user.user.interest &&
                        user.user.interest.length > 0 &&
                        userData.data.user.interest &&
                        userData.data.user.interest.length > 0
                    ) {
                        return this.countSimilarities(
                            user.user.interest,
                            userData.data.user.interest
                        )
                    }

                    return 0
                })
            )
    }

    reportByDialog(username: string, id: string): void {
        const dialogRef = this.dialog.open(DialogReportComponent, {
            width: '50vw',
            data: {
                username
            }
        })

        dialogRef.afterClosed().subscribe(description => {
            if (description) {
                const reportForm = {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    reported_user_id: id,
                    description
                }

                this.dataService
                    .reportUserProfile(reportForm)
                    .pipe(takeUntil(this.ngUnsubscribe$))
                    .subscribe()
            }
        })
    }

    countSimilarities(profileUserInterests: Array<string>, authUserInterests: Array<string>) {
        let matches = 0

        for (const profileUserInterest of profileUserInterests) {
            if (authUserInterests.indexOf(profileUserInterest) !== -1) matches++
        }

        return matches
    }

    ngOnInit() {
        this.username = this.activatedRoute.snapshot.paramMap.get('username')

        this.getUser()
    }

    ngOnDestroy() {
        this.ngUnsubscribe$.next()

        this.ngUnsubscribe$.complete()
    }
}
