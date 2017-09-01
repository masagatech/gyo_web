import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { VehicleReportsComponent } from './rptveh.comp';
import { VehicleService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: VehicleReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptpsngr", "rights": "view", "urlname": "/vehicle" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    VehicleReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, VehicleService]
})

export class VehicleReportsModule {
  public static routes = routes;
}
