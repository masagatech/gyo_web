import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { PassengerTripsReportsComponent } from './rptpsngrtrp.comp';
import { ReportsService } from '@services/reports';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: PassengerTripsReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptpsngrtrp", "rights": "view", "urlname": "/passengertrips" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    PassengerTripsReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class PassengerTripsReportsModule {
  public static routes = routes;
}
