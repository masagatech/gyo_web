import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { AddVehicleComponent } from './aded/addveh.comp';
import { ViewVehicleComponent } from './view/viewveh.comp';

import { VehicleService } from '@services/master';

import { DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewVehicleComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "veh", "rights": "view", "urlname": "/vehicle" }
      },
      {
        path: 'add', component: AddVehicleComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "veh", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'details/:id', component: AddVehicleComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "veh", "rights": "edt", "urlname": "/edit" }
      },
      {
        path: 'edit/:id', component: AddVehicleComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "veh", "rights": "edt", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddVehicleComponent,
    ViewVehicleComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule,
    DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, VehicleService, CommonService]
})

export class VehicleModule {
  public static routes = routes;
}
