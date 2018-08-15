import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { AddUserWorkspaceMapComponent } from './adduwm.comp';

import { UserService } from '@services/master';

import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddUserWorkspaceMapComponent, canActivate: [AuthGuard],
        data: { "module": "set", "submodule": "uwm", "rights": "view", "urlname": "/userworkspacemap" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AddUserWorkspaceMapComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), AutoCompleteModule
  ],

  providers: [AuthGuard, , CommonService, UserService]
})

export class UserWorkspaceMapModule {
  public static routes = routes;
}
