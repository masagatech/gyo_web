import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AdmissionService } from '@services/erp';
import { PassengerReportsService } from '@services/reports';

import { GeneralRegisterReportsComponent } from './rptgrstud.comp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: GeneralRegisterReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptadm", "submodule": "rptgrstud", "rights": "view", "urlname": "/generalregister" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    GeneralRegisterReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, AdmissionService, PassengerReportsService]
})

export class GeneralRegisterReportsModule {
  public static routes = routes;
}
