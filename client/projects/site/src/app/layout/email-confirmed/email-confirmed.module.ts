import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { EmailConfirmedRoutingModule } from './email-confirmed-routing.module'
import { MaterialModule } from '../../shared/material.module'

@NgModule({
    declarations: [EmailConfirmedRoutingModule.components],
    imports: [CommonModule, EmailConfirmedRoutingModule, MaterialModule]
})
export class EmailConfirmedModule {}
