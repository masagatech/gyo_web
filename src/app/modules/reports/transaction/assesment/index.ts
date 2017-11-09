import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AssesmentReportsComponent } from './rptass.comp';
import { AssesmentService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AssesmentReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptass", "rights": "view", "urlname": "/assesment" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AssesmentReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, AssesmentService]
})

export class AssesmentReportsModule {
  public static routes = routes;
}
