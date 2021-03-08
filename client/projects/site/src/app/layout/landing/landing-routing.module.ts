import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CommonComponent } from './common/common.component'
import { ContactComponent } from './contact/contact.component'
import { FeaturesComponent } from './features/features.component'
import { HeroComponent } from './hero/hero.component'
import { LandingComponent } from './landing.component'
import { FormCanDeactivateGuard } from '../../core/guards/form-can-deactivate.guard'

const routes: Routes = [
    { path: '', component: LandingComponent, canDeactivate: [FormCanDeactivateGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LandingRoutingModule {
    static components = [
        LandingComponent,
        CommonComponent,
        ContactComponent,
        FeaturesComponent,
        HeroComponent
    ]
}
