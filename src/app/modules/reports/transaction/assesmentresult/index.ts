import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { AssesmentResultReportsComponent } from './rptassres.comp';
import { AssesmentService } from '@services/erp';
import { AssesmentReportService } from '@services/reports';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AssesmentResultReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptass", "rights": "view", "urlname": "/assesmentresult" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AssesmentResultReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, AssesmentService, AssesmentReportService, CommonService]
})

export class AssesmentResultReportsModule {
  public static routes = routes;
}
