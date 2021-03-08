import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { InterestListRoutingModule } from './interest-list-routing.module'
import { InterestListComponent } from './interest-list.component'

@NgModule({
    declarations: [InterestListComponent],
    imports: [CommonModule, InterestListRoutingModule]
})
export class InterestListModule {}
