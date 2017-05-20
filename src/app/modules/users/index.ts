import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddUserComponent } from './aded/adduser.comp';
import { ViewUserComponent } from './view/viewuser.comp';

import { UserService } from '../../_services/users/user-service';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewUserComponent },
      { path: 'add', component: AddUserComponent },
      { path: 'details/:id', component: AddUserComponent },
      { path: 'edit/:id', component: AddUserComponent }
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

  providers: [UserService]
})

export class UserModule {
  public static routes = routes;
}
