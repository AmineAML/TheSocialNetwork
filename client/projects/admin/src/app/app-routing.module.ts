import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    {
        path: 'login',
        loadChildren: () => import('./layout/login/login.module').then(m => m.LoginModule)
    }
    //{ path: 'landing', loadChildren: () => import('./layout/login/login.module').then(m => m.LandingModule) },
    //{ path: '404', loadChildren: () => import('./layout/login/login.module').then(m => m.ErrorModule) },
    //{ path: '**', redirectTo: '404' }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
