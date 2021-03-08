import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { EmailConfirmedComponent } from './email-confirmed.component'

const routes: Routes = [{ path: '', component: EmailConfirmedComponent }]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailConfirmedRoutingModule {
    static components = [EmailConfirmedComponent]
}
