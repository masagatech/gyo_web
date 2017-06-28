import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { DailyAttendanceReportsComponent } from './rptdailyatt.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: DailyAttendanceReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptdailyatt", "rights": "view", "urlname": "/dailyattendance" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    DailyAttendanceReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class DailyAttendanceReportsModule {
  public static routes = routes;
}
