import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { ViewDeviceComponent } from './view/viewdev.comp';
import { AddDeviceComponent } from './aded/adddev.comp';

import { InventoryService } from '@services/master';

import { AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewDeviceComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "inv", "rights": "allowed", "urlname": "/device" }
      },{
        path: 'add', component: AddDeviceComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "inv", "rights": "add", "urlname": "/add" }
      },{
        path: 'edit/:id', component: AddDeviceComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "inv", "rights": "edit", "urlname": "/edit" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    ViewDeviceComponent,
    AddDeviceComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), AutoCompleteModule, FileUploadModule, SharedComponentModule
  ],

  providers: [AuthGuard, InventoryService, CommonService]
})

export class DeviceModule {
  public static routes = routes;
}
