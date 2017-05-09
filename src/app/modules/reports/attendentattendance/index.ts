import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AttendentAttendanceReportsComponent } from './rptattnatt.comp';
import { ReportsService } from '../../../_services/reports/rpt-service';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: AttendentAttendanceReportsComponent }
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

  providers: [ReportsService]
})

export class AttendentAttendanceReportsModule {
  public static routes = routes;
}
