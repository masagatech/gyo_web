import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { AddDriverComponent } from './aded/adddriver.comp';
import { ViewDriverComponent } from './view/viewdriver.comp';

import { DriverService } from '@services/master';

import { DataTableModule, DataGridModule, PanelModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewDriverComponent, canActivate: [AuthGuard],
        data: { "module": "trnsp", "submodule": "drv", "rights": "view", "urlname": "/driver" }
      },
      {
        path: 'add', component: AddDriverComponent, canActivate: [AuthGuard],
        data: { "module": "trnsp", "submodule": "drv", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'details/:id', component: AddDriverComponent, canActivate: [AuthGuard],
        data: { "module": "trnsp", "submodule": "drv", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'edit/:id', component: AddDriverComponent, canActivate: [AuthGuard],
        data: { "module": "trnsp", "submodule": "drv", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddDriverComponent,
    ViewDriverComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule,
    DataTableModule, DataGridModule, PanelModule, FileUploadModule
  ],

  providers: [AuthGuard, CommonService, DriverService]
})

export class DriverModule {
  public static routes = routes;
}
