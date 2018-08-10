import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { PassengerReportsService } from '@services/reports';

import { ParentsReportsComponent } from './rptparents.comp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ParentsReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptparents", "rights": "view", "urlname": "/parents" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ParentsReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, CommonService, PassengerReportsService]
})

export class ParentsReportsModule {
  public static routes = routes;
}
