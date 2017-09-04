import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { AddPassengerComponent } from './aded/addpsngr.comp';
import { ViewPassengerComponent } from './view/viewpsngr.comp';

import { PassengerService } from '@services/master';

import {
  LazyLoadEvent, DataTableModule, DataGridModule, PanelModule, CheckboxModule,
  AutoCompleteModule, FileUploadModule
} from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewPassengerComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "psngr", "rights": "view", "urlname": "passenger" } },
      { path: 'add', component: AddPassengerComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "psngr", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddPassengerComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "psngr", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddPassengerComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "psngr", "rights": "edit", "urlname": "/edit" } }
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
    CheckboxModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, PassengerService]
})

export class PassengerModule {
  public static routes = routes;
}