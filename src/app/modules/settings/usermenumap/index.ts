import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddUserMenuMapComponent } from './aded/addumm.comp';
import { ViewUserMenuMapComponent } from './view/viewumm.comp';

import { UserService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: AddUserMenuMapComponent, canActivate: [AuthGuard], data: { "module": "set", "submodule": "umm", "rights": "view", "urlname": "/usermenumap" } },
      { path: 'add', component: AddUserMenuMapComponent, canActivate: [AuthGuard], data: { "module": "set", "submodule": "umm", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddUserMenuMapComponent, canActivate: [AuthGuard], data: { "module": "set", "submodule": "umm", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddUserMenuMapComponent, canActivate: [AuthGuard], data: { "module": "set", "submodule": "umm", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddUserMenuMapComponent,
    ViewUserMenuMapComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    CheckboxModule, AutoCompleteModule
  ],

  providers: [AuthGuard, UserService]
})

export class UserMenuMapModule {
  public static routes = routes;
}
