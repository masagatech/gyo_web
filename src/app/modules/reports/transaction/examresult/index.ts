import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ExamResultReportsComponent } from './rptexres.comp';
import { ExamService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ExamResultReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptexres", "rights": "view", "urlname": "/examresult" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ExamResultReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, ExamService]
})

export class ExamResultReportsModule {
  public static routes = routes;
}
