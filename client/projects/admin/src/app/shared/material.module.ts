import { NgModule } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'

const material = [
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule
]

@NgModule({
    declarations: [],
    imports: [],
    exports: [material]
})
export class MaterialModule {}
