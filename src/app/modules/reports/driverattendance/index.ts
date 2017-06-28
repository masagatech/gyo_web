import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { DriverAttendanceReportsComponent } from './rptdrvatt.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: DriverAttendanceReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptdrvatt", "rights": "view", "urlname": "/driverattendance" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    DriverAttendanceReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class DriverAttendanceReportsModule {
  public static routes = routes;
}
