import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RegisterRoutingModule } from './register-routing.module'
import { MaterialModule } from '../../shared/material.module'

@NgModule({
    declarations: [RegisterRoutingModule.components],
    imports: [CommonModule, RegisterRoutingModule, MaterialModule]
})
export class RegisterModule {}
