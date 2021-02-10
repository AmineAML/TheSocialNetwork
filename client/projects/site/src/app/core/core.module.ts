import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialModule } from 'projects/admin/src/app/shared/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { MemberGuard } from './guards/member.guard';
import { AuthService } from './services/auth.service';
import { EmailNotConfirmedComponent } from './components/email-not-confirmed/email-not-confirmed.component';
import { DialogReportComponent } from './components/dialog-report/dialog-report.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    EmailNotConfirmedComponent,
    DialogReportComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    EmailNotConfirmedComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    MemberGuard,
    AuthService
  ]
})
export class CoreModule { }
