import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { AddUserWorkspaceMapComponent } from './adduwm.comp';

import { WorkspaceService, UserService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

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
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    CheckboxModule, AutoCompleteModule
  ],

  providers: [AuthGuard, WorkspaceService, UserService]
})

export class UserWorkspaceMapModule {
  public static routes = routes;
}
