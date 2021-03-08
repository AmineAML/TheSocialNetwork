import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { LoginRoutingModule } from './login-routing.module'
import { MaterialModule } from '../../shared/material.module'

@NgModule({
    declarations: [LoginRoutingModule.components],
    imports: [CommonModule, LoginRoutingModule, MaterialModule]
})
export class LoginModule {}
