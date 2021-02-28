import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ListComponent } from './list/list.component';
import { ReportedComponent } from './reported/reported.component';
import { EmailsMessagingComponent } from './emails-messaging/emails-messaging.component';


@NgModule({
  declarations: [DashboardComponent, ListComponent, ReportedComponent, EmailsMessagingComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
