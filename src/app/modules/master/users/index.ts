import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddUserComponent } from './aded/adduser.comp';
import { ViewUserComponent } from './view/viewuser.comp';

import { UserService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '',
    children: [
      { path: '', component: ViewUserComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "usr", "rights": "view", "urlname": "/user" } },
      { path: 'add', component: AddUserComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "usr", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddUserComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "usr", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddUserComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "usr", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];


@NgModule({
  declarations: [
    AddUserComponent,
    ViewUserComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule, AutoCompleteModule
  ],

  providers: [AuthGuard, UserService]
})

export class UserModule {
  public static routes = routes;
}
