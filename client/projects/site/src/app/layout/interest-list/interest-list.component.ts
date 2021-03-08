import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { DataService } from '../../core/services/data.service'
import { InterestData } from '../../shared/models'

export interface Interest {
    name: string
}

@Component({
    selector: 'app-interest-list',
    templateUrl: './interest-list.component.html',
    styleUrls: ['./interest-list.component.scss']
})
export class InterestListComponent {
    interests$: Observable<Interest[]>

    constructor(private dataService: DataService) {
        this.interests$ = this.dataService.findAllInterestsSorted().pipe(
            map((interestData: InterestData) => {
                const interestsArray: Interest[] = []

                interestData.data.interests.forEach(interest => {
                    interestsArray.push({ name: interest.name })
                })

                return interestsArray
            })
        )
    }
}
