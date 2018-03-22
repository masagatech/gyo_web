import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { SpeedReportsComponent } from './rptspeed.comp';
import { ReportsService } from '@services/reports';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: SpeedReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptspeed", "rights": "view", "urlname": "/milege" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    SpeedReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, ReportsService]
})

export class SpeedReportsModule {
  public static routes = routes;
}
