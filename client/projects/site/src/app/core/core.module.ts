import { APP_INITIALIZER, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { RouterModule } from '@angular/router'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptor } from './interceptors/auth.interceptor'
import { AuthGuard } from './guards/auth.guard'
import { MemberGuard } from './guards/member.guard'
import { AuthService } from './services/auth.service'
import { EmailNotConfirmedComponent } from './components/email-not-confirmed/email-not-confirmed.component'
import { DialogReportComponent } from './components/dialog-report/dialog-report.component'
import { CustomPreloadingStrategyService } from './services/custom-preloading-strategy.service'
import { AppInitializeService } from './services/app-initialize.service'
import { DialogConfirmationComponent } from './components/dialog-confirmation/dialog-confirmation.component'
import { MaterialModule } from '../shared/material.module'

export const initializeApp1 = (appInitializeService: AppInitializeService) => (): Promise<any> =>
    appInitializeService.init()

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        EmailNotConfirmedComponent,
        DialogReportComponent,
        DialogConfirmationComponent
    ],
    imports: [CommonModule, MaterialModule, FontAwesomeModule, RouterModule],
    exports: [HeaderComponent, FooterComponent, EmailNotConfirmedComponent],
    providers: [
        AuthGuard,
        MemberGuard,
        AuthService,
        CustomPreloadingStrategyService,
        AppInitializeService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp1,
            deps: [AppInitializeService],
            multi: true
        }
    ]
})
export class CoreModule {}
