import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { AddUserMenuMapComponent } from './addumm.comp';

import { UserService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddUserMenuMapComponent, canActivate: [AuthGuard],
        data: { "module": "set", "submodule": "umm", "rights": "allowed", "urlname": "/usermenumap" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddUserMenuMapComponent
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
