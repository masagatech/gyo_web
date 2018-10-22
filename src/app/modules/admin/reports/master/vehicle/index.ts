import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { VehicleMasterReportsComponent } from './rptveh.comp';
import { ReportsService } from '@services/reports';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: VehicleMasterReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpttrnsp", "submodule": "rptvehmst", "rights": "view", "urlname": "/vehicle" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    VehicleMasterReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, ReportsService, CommonService]
})

export class VehicleMasterReportsModule {
  public static routes = routes;
}
