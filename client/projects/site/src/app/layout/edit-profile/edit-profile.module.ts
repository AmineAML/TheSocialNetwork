import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { EditProfileRoutingModule } from './edit-profile-routing.module'
import { MaterialModule } from '../../shared/material.module'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@NgModule({
    declarations: [EditProfileRoutingModule.components],
    imports: [CommonModule, EditProfileRoutingModule, MaterialModule, FontAwesomeModule]
})
export class EditProfileModule {}
