import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AdmissionService } from '@services/erp';
import { PassengerReportsService } from '@services/reports';

import { CategoryWiseReportsComponent } from './rptcatstud.comp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: CategoryWiseReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptcatstud", "rights": "view", "urlname": "/categorywise" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    CategoryWiseReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, AdmissionService, PassengerReportsService]
})

export class CategoryWiseReportsModule {
  public static routes = routes;
}
