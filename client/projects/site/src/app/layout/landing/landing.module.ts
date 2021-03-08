import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { LandingRoutingModule } from './landing-routing.module'
import { MaterialModule } from '../../shared/material.module'

@NgModule({
    declarations: [LandingRoutingModule.components],
    imports: [CommonModule, LandingRoutingModule, MaterialModule]
})
export class LandingModule {}
