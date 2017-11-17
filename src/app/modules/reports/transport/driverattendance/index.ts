import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { DriverAttendanceComponent } from './rptdrvatt.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: DriverAttendanceComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptdrvatt", "rights": "view", "urlname": "/daily" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    DriverAttendanceComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class DriverAttendanceModule {
  public static routes = routes;
}
