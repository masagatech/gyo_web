import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AdmissionService } from '@services/erp';
import { PassengerReportsService } from '@services/reports';

import { AgeWiseReportsComponent } from './rptagestud.comp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AgeWiseReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptagestud", "rights": "view", "urlname": "/agewise" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AgeWiseReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, AdmissionService, PassengerReportsService]
})

export class AgeWiseReportsModule {
  public static routes = routes;
}
