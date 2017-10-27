import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { PassengerMasterComponent } from './rptpsngrmst.comp';
import { AdmissionService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: PassengerMasterComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptpsngrprof", "rights": "view", "urlname": "/student" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    PassengerMasterComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, AdmissionService]
})

export class PassengerReportsModule {
  public static routes = routes;
}
