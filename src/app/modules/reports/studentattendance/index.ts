import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StudentAttendanceReportsComponent } from './rptstudsatt.comp';
import { ReportsService } from '../../../_services/reports/rpt-service';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: StudentAttendanceReportsComponent }
    ]
  },
];

@NgModule({
  declarations: [
    StudentAttendanceReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [ReportsService]
})

export class StudentAttendanceReportsModule {
  public static routes = routes;
}
