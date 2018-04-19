import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard } from '@services';

import { MenuLogReportsComponent } from './rptmnlg.comp';
import { LogReportService } from '@services/reports';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: MenuLogReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptml", "rights": "view", "urlname": "/menulog" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    MenuLogReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, LogReportService]
})

export class MenuLogModule {
  public static routes = routes;
}
