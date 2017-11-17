import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { TeacherLeaveReportsComponent } from './rpttchrlv.comp';
import { LeaveService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TeacherLeaveReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rpttchrlv", "rights": "view", "urlname": "/teacherleave" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TeacherLeaveReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, LeaveService]
})

export class TeacherLeaveReportsModule {
  public static routes = routes;
}
