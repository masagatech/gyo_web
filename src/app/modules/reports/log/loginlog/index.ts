import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { LoginLogReportsComponent } from './rptlog.comp';
import { LogReportService } from '@services/reports';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: LoginLogReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptll", "rights": "view", "urlname": "/loginlog" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    LoginLogReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, LogReportService]
})

export class LoginLogModule {
  public static routes = routes;
}
