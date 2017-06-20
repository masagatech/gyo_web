import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';

import { AddUserMenuMapComponent } from './aded/addumm.comp';
import { ViewUserMenuMapComponent } from './view/viewumm.comp';

import { UserService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: AddUserMenuMapComponent },
      { path: 'add', component: AddUserMenuMapComponent },
      { path: 'details/:id', component: AddUserMenuMapComponent },
      { path: 'edit/:id', component: AddUserMenuMapComponent }
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

  providers: [UserService]
})

export class UserMenuMapModule {
  public static routes = routes;
}
