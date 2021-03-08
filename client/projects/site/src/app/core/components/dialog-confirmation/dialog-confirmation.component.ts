import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'

@Component({
    selector: 'app-dialog-confirmation',
    templateUrl: './dialog-confirmation.component.html',
    styleUrls: ['./dialog-confirmation.component.scss']
})
export class DialogConfirmationComponent {
    constructor(private readonly dialogRef: MatDialogRef<DialogConfirmationComponent, boolean>) {}

    cancel() {
        this.dialogRef.close(false)
    }

    confirm() {
        this.dialogRef.close(true)
    }
}
