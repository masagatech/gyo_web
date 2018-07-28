import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { DailyFeesReportsComponent } from './rptdailyfees.comp';
import { FeesService } from '@services/erp';
import { FeesReportsService } from '@services/reports';

import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: DailyFeesReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptstudfees", "rights": "view", "urlname": "/feescollection" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    DailyFeesReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), AutoCompleteModule
  ],

  providers: [AuthGuard, FeesService, FeesReportsService, CommonService]
})

export class DailyFeesReportsModule {
  public static routes = routes;
}
