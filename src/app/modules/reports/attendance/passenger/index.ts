import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { PassengerAttendanceComponent } from './rptpsngratt.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: PassengerAttendanceComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptpsngratt", "rights": "view", "urlname": "/passenger" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    PassengerAttendanceComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class PassengerAttendanceModule {
  public static routes = routes;
}
