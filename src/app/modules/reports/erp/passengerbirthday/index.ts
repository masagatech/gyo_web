import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AdmissionService } from '@services/erp';
import { PassengerReportsService } from '@services/reports';

import { PassengerBirthdayReportsComponent } from './rptpsngrbirth.comp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: PassengerBirthdayReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptpsngrdob", "rights": "view", "urlname": "/birthday" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    PassengerBirthdayReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, AdmissionService, PassengerReportsService]
})

export class PassengerBirthdayReportsModule {
  public static routes = routes;
}
