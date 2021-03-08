import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { InterestListComponent } from './interest-list.component'

const routes: Routes = [
    {
        path: '',
        component: InterestListComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InterestListRoutingModule {
    static components = [InterestListComponent]
}
