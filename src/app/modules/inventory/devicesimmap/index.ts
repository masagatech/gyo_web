import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { AddDeviceSimMapComponent } from './aded/adddsm.comp';
import { ViewDeviceSimMapComponent } from './view/viewdsm.comp';

import { InventoryService } from '@services/master';

import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewDeviceSimMapComponent, canActivate: [AuthGuard],
        data: { "module": "inv", "submodule": "devsimmap", "rights": "view", "urlname": "/devicesimmap" }
      },{
        path: 'add', component: AddDeviceSimMapComponent, canActivate: [AuthGuard],
        data: { "module": "inv", "submodule": "devsimmap", "rights": "add", "urlname": "/add" }
      },{
        path: 'edit/:id', component: AddDeviceSimMapComponent, canActivate: [AuthGuard],
        data: { "module": "inv", "submodule": "devsimmap", "rights": "edit", "urlname": "/edit" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    ViewDeviceSimMapComponent,
    AddDeviceSimMapComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), AutoCompleteModule, SharedComponentModule
  ],

  providers: [AuthGuard, InventoryService, CommonService]
})

export class DeviceSimMapModule {
  public static routes = routes;
}
