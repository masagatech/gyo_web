import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { AttendentAttendanceReportsComponent } from './rptattnatt.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AttendentAttendanceReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptattnatt", "rights": "view", "urlname": "/attendantattendance" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AttendentAttendanceReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class AttendentAttendanceReportsModule {
  public static routes = routes;
}
