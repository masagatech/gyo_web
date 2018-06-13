import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AttendanceService } from '@services/erp';
import { AttendanceReportsService } from '@services/reports';

import { MonthlyPresenceReportsComponent } from './rptmonprsnt.comp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: MonthlyPresenceReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptmonprsnt", "rights": "view", "urlname": "/monthlypresence" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    MonthlyPresenceReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, AttendanceService, AttendanceReportsService]
})

export class MonthlyPresenceReportsModule {
  public static routes = routes;
}
