import { Component, Inject } from '@angular/core'
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'

interface SnackBar {
    message: string
    hasError: boolean
}

@Component({
    selector: 'app-message-snack-bar',
    templateUrl: './message-snack-bar.component.html',
    styleUrls: ['./message-snack-bar.component.scss']
})
export class MessageSnackBarComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBar) {}
}
