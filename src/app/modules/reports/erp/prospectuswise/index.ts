import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AdmissionService } from '@services/erp';
import { PassengerReportsService } from '@services/reports';

import { ProspectusWiseReportsComponent } from './rptprspctwise.comp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ProspectusWiseReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptadm", "submodule": "rptprspctstud", "rights": "view", "urlname": "/prospectuswise" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ProspectusWiseReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, AdmissionService, PassengerReportsService]
})

export class ProspectusWiseReportsModule {
  public static routes = routes;
}
