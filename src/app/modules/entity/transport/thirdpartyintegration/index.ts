import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { ThirdPartyIntegrationComponent } from './addtpi.comp';

import { VehicleService } from '@services/master';

import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ThirdPartyIntegrationComponent, canActivate: [AuthGuard],
        data: { "module": "trnsp", "submodule": "tpi", "rights": "allowed", "urlname": "/thirdpartyintegration" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ThirdPartyIntegrationComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule, AutoCompleteModule
  ],

  providers: [AuthGuard, VehicleService, CommonService]
})

export class ThirdPartyIntegrationModule {
  public static routes = routes;
}
