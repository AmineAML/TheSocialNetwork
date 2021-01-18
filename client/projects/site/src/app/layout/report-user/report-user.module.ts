import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportUserRoutingModule } from './report-user-routing.module';
import { ReportUserComponent } from './report-user.component';


@NgModule({
  declarations: [ReportUserComponent],
  imports: [
    CommonModule,
    ReportUserRoutingModule
  ]
})
export class ReportUserModule { }
