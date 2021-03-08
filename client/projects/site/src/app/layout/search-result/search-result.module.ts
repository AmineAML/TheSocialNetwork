import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SearchResultRoutingModule } from './search-result-routing.module'
import { MaterialModule } from '../../shared/material.module'

@NgModule({
    declarations: [SearchResultRoutingModule.components],
    imports: [CommonModule, SearchResultRoutingModule, MaterialModule]
})
export class SearchResultModule {}
