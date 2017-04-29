import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../_shared/sharedcomp.module';

import { AddUserRightsComponent } from './aded/addur.comp';
import { ViewUserRightsComponent } from './view/viewur.comp';

import { UserService } from '../../_services/users/user-service';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: AddUserRightsComponent },
      { path: 'add', component: AddUserRightsComponent },
      { path: 'details/:id', component: AddUserRightsComponent },
      { path: 'edit/:id', component: AddUserRightsComponent }
    ]
  },
];


@NgModule({
  declarations: [
    AddUserRightsComponent,
    ViewUserRightsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    CheckboxModule, AutoCompleteModule
  ],

  providers: [UserService]
})

export class UserRightsModule {
  public static routes = routes;
}
