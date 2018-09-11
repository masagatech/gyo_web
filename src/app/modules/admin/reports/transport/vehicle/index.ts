import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { VehicleReportsComponent } from './rptveh.comp';
import { ReportsService } from '@services/reports';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: VehicleReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpttrnsp", "submodule": "rptveh", "rights": "view", "urlname": "/vehicle" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    VehicleReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, ReportsService, CommonService]
})

export class VehicleReportsModule {
  public static routes = routes;
}
