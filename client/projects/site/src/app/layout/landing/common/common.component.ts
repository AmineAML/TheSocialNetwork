import { Component, Input } from '@angular/core'

export interface Interest {
    name: string
}

@Component({
    selector: 'app-common',
    templateUrl: './common.component.html',
    styleUrls: ['./common.component.scss']
})
export class CommonComponent {
    @Input() options: Interest[]

    constructor() {}
}
