import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AttendanceService } from '@services/erp';
import { AttendanceReportsService } from '@services/reports';

import { ClassWiseAttednacneReportsComponent } from './rptclsattnd.comp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ClassWiseAttednacneReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptcatstud", "rights": "view", "urlname": "/classwiseattendance" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ClassWiseAttednacneReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, AttendanceService, AttendanceReportsService]
})

export class ClassWiseAttednacneReportsModule {
  public static routes = routes;
}
