import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AdmissionService } from '@services/erp';
import { PassengerReportsService } from '@services/reports';

import { PassengerLeftReportsComponent } from './rptpsngrleft.comp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: PassengerLeftReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptadm", "submodule": "rptpsngrleft", "rights": "view", "urlname": "/left" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    PassengerLeftReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, AdmissionService, PassengerReportsService]
})

export class PassengerLeftReportsModule {
  public static routes = routes;
}
