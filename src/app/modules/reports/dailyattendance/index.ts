import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DailyAttendanceReportsComponent } from './attrpt.comp';
import { ReportsService } from '../../../_services/reports/rpt-service';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: DailyAttendanceReportsComponent }
    ]
  },
];

@NgModule({
  declarations: [
    DailyAttendanceReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [ReportsService]
})

export class DailyAttendanceReportsModule {
  public static routes = routes;
}
