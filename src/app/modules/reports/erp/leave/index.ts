import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { LeaveReportsComponent } from './rptleave.comp';
import { PassengerLeaveService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: LeaveReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptlv", "rights": "view", "urlname": "/leave" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    LeaveReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, PassengerLeaveService]
})

export class LeaveReportsModule {
  public static routes = routes;
}
