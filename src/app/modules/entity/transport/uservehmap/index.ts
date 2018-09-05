import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { AddUserVehicleMapComponent } from './adduvm.comp';

import { UserVehicleMapService } from '@services/master';
import { NgxSortableModule } from 'ngx-sortable';
import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddUserVehicleMapComponent, canActivate: [AuthGuard],
        data: { "module": "set", "submodule": "uvm", "rights": "allowed", "urlname": "/uservehiclemap" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddUserVehicleMapComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    AutoCompleteModule, NgxSortableModule
  ],

  providers: [AuthGuard, CommonService, UserVehicleMapService]
})

export class UserVehicleMapModule {
  public static routes = routes;
}
