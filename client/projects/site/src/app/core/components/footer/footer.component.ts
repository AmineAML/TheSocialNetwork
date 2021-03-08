import { Component, OnInit } from '@angular/core'
import { faCode } from '@fortawesome/free-solid-svg-icons'

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    faCode = faCode

    constructor() {}

    ngOnInit(): void {}
}
