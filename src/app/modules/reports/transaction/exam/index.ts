import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ExamReportsComponent } from './rptexam.comp';
import { ExamService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ExamReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptexam", "rights": "view", "urlname": "/exam" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ExamReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, ExamService]
})

export class ExamReportsModule {
  public static routes = routes;
}
