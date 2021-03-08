import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { CanDeactivate, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { DialogConfirmationComponent } from '../components/dialog-confirmation/dialog-confirmation.component'

export interface ComponentCanDeactivate {
    canDeactivate(): boolean | Observable<boolean>
}

export const canDeactivateState = {
    defendAgainstBrowserBackButton: false
}

@Injectable({
    providedIn: 'root'
})
export class FormCanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
    constructor(readonly dialog: MatDialog) {}

    canDeactivate(
        component: ComponentCanDeactivate /*, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot*/
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return (
            component.canDeactivate() ||
            this.dialog
                .open<DialogConfirmationComponent, void, boolean>(DialogConfirmationComponent, {
                    disableClose: true
                })
                .afterClosed()
                .pipe(
                    tap(confirmed => {
                        if (!confirmed && canDeactivateState.defendAgainstBrowserBackButton) {
                            history.pushState(null, '', '')
                        }
                    })
                )
        )
    }
}
