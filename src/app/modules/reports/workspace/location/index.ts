import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { LocationReportsComponent } from './rptloc.comp';
import { LocationService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: LocationReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptloc", "rights": "view", "urlname": "/location" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    LocationReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, LocationService]
})

export class LocationReportsModule {
  public static routes = routes;
}
