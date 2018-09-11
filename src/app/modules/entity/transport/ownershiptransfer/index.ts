import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { OwnerShipTranferComponent } from './ownertransfer.comp';

import { VehicleService } from '@services/master';

import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: OwnerShipTranferComponent, canActivate: [AuthGuard],
        data: { "module": "trnsp", "submodule": "onrtrnsf", "rights": "allowed", "urlname": "/ownershiptransfer" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    OwnerShipTranferComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule, AutoCompleteModule
  ],

  providers: [AuthGuard, VehicleService, CommonService]
})

export class OwnerShipTranferModule {
  public static routes = routes;
}
