import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { AuthService } from '../../services/auth.service'

@Component({
    selector: 'app-email-not-confirmed',
    templateUrl: './email-not-confirmed.component.html',
    styleUrls: ['./email-not-confirmed.component.scss']
})
export class EmailNotConfirmedComponent implements OnInit, OnDestroy {
    @Output() closeComponent = new EventEmitter()

    //Default to true meaning confirmed and don't show confirmation request expect if modified to false
    isConfirmedEmail = true

    //Handle unsubscriptions
    private ngUnsubscribe = new Subject()

    constructor(private authService: AuthService) {}

    close() {
        this.closeComponent.emit('close')
    }

    confirmedEmailLink() {
        this.authService
            .getConfirmedEmailLink()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((value: boolean) => {
                if (value) {
                    this.isConfirmedEmail = true
                } else {
                    this.isConfirmedEmail = false
                }
            })
    }

    ngOnInit(): void {
        this.confirmedEmailLink()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()

        this.ngUnsubscribe.complete()
    }
}
