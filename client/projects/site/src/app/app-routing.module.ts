import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './core/guards/auth.guard'
import { MemberGuard } from './core/guards/member.guard'
import { CustomPreloadingStrategyService } from './core/services/custom-preloading-strategy.service'

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./layout/landing/landing.module').then(m => m.LandingModule),
        data: {
            preload: true
        }
    },
    {
        path: 'login',
        loadChildren: () => import('./layout/login/login.module').then(m => m.LoginModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'register',
        loadChildren: () => import('./layout/register/register.module').then(m => m.RegisterModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'edit-profile',
        loadChildren: () =>
            import('./layout/edit-profile/edit-profile.module').then(m => m.EditProfileModule),
        canActivate: [MemberGuard]
    },
    {
        path: 'profile/:username',
        loadChildren: () => import('./layout/profile/profile.module').then(m => m.ProfileModule),
        canActivate: [MemberGuard]
    },
    {
        path: 'search',
        loadChildren: () =>
            import('./layout/search-result/search-result.module').then(m => m.SearchResultModule),
        canActivate: [MemberGuard]
    },
    {
        path: 'confirm_email/:link',
        loadChildren: () =>
            import('./layout/email-confirmed/email-confirmed.module').then(
                m => m.EmailConfirmedModule
            )
    },
    {
        path: 'hobbies',
        loadChildren: () =>
            import('./layout/interest-list/interest-list.module').then(m => m.InterestListModule)
    }
    //{ path: '', redirectTo: 'landing', pathMatch: 'full' },
    //{ path: '404', loadChildren: () => import('./layout/error/error.module').then(m => m.ErrorModule) },
    //{ path: '**', redirectTo: '404' }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: CustomPreloadingStrategyService
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
