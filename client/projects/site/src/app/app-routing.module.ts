import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./layout/landing/landing.module').then(m => m.LandingModule) },
  { path: 'login', loadChildren: () => import('./layout/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./layout/register/register.module').then(m => m.RegisterModule) },
  { path: 'edit-profile', loadChildren: () => import('./layout/edit-profile/edit-profile.module').then(m => m.EditProfileModule) },
  { path: 'profile/:id', loadChildren: () => import('./layout/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'search', loadChildren: () => import('./layout/search-result/search-result.module').then(m => m.SearchResultModule) },
  //{ path: '', redirectTo: 'landing', pathMatch: 'full' },
  //{ path: '404', loadChildren: () => import('./layout/error/error.module').then(m => m.ErrorModule) },
  //{ path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
