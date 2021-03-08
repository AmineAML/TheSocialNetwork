import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { EditProfileComponent } from './edit-profile.component'
import { FormCanDeactivateGuard } from '../../core/guards/form-can-deactivate.guard'

const routes: Routes = [
    { path: '', component: EditProfileComponent, canDeactivate: [FormCanDeactivateGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditProfileRoutingModule {
    static components = [EditProfileComponent]
}
