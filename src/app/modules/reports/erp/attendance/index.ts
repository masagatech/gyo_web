import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AttendanceReportsComponent } from './attendance.comp';

import { AttendanceService } from '@services/erp';
import { AttendanceReportsService } from '@services/reports';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AttendanceReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptpsngrattnd", "rights": "view", "urlname": "/attendance" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AttendanceReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, AttendanceService, AttendanceReportsService]
})

export class AttendanceReportsModule {
  public static routes = routes;
}
