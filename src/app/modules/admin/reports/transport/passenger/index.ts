import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { AdmissionService } from '@services/erp';
import { PassengerReportsService } from '@services/reports';

import { PassengerMasterComponent } from './rptpsngrmst.comp';

import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: PassengerMasterComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptpsngrprof", "rights": "view", "urlname": "/passenger" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    PassengerMasterComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), AutoCompleteModule
  ],

  providers: [AuthGuard, CommonService, AdmissionService, PassengerReportsService]
})

export class PassengerReportsModule {
  public static routes = routes;
}
