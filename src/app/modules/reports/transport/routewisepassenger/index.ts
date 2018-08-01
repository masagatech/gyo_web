import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { RouteWisePassengerComponent } from './rtwisepsngr.comp';
import { ReportsService } from '@services/reports';

import { DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: RouteWisePassengerComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rtwisepsngr", "rights": "view", "urlname": "/routewisepassenger" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    RouteWisePassengerComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService, CommonService]
})

export class RouteWisePassengerModule {
  public static routes = routes;
}
