import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ProfileRoutingModule } from './profile-routing.module'
import { MaterialModule } from '../../shared/material.module'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@NgModule({
    declarations: [ProfileRoutingModule.components],
    imports: [CommonModule, ProfileRoutingModule, MaterialModule, FontAwesomeModule]
})
export class ProfileModule {}
