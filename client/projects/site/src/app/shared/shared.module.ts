import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MessageSnackBarComponent } from './components/message-snack-bar/message-snack-bar.component'
import { MaterialModule } from './material.module'

@NgModule({
    declarations: [MessageSnackBarComponent],
    imports: [CommonModule, MaterialModule],
    exports: [MessageSnackBarComponent]
})
export class SharedModule {}
