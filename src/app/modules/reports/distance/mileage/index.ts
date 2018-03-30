import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { MileageReportsComponent } from './rptmileage.comp';
import { ReportsService } from '@services/reports';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: MileageReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptmileage", "rights": "view", "urlname": "/mileage" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    MileageReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, ReportsService]
})

export class MileageReportsModule {
  public static routes = routes;
}
