import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../../_services/authguard-service';

import { AttendentAttendanceComponent } from './rptattnatt.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AttendentAttendanceComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptattnatt", "rights": "view", "urlname": "/attendent" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AttendentAttendanceComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class AttendentAttendanceModule {
  public static routes = routes;
}
