import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { AddPassengerComponent } from './aded/addpsngr.comp';
import { ViewPassengerComponent } from './view/viewpsngr.comp';

import { AdmissionService } from '@services/erp';

import {
  DataTableModule, DataGridModule, PanelModule, AutoCompleteModule, FileUploadModule
} from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: 'profile', component: ViewPassengerComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "psngrprof", "rights": "view", "urlname": "passenger" }
      },
      {
        path: 'add', component: AddPassengerComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "psngrprof", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'details/:id', component: AddPassengerComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "psngrprof", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'edit/:id', component: AddPassengerComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "psngrprof", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];


@NgModule({
  declarations: [
    AddPassengerComponent,
    ViewPassengerComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, DataGridModule, PanelModule,
    AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, CommonService, AdmissionService]
})

export class PassengerModule {
  public static routes = routes;
}
