import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';
import { } from '@services';

import { AddWorkspaceComponent } from './aded/addws.comp';
import { ViewWorkspaceComponent } from './view/viewws.comp';

import { WorkspaceService, EntityService } from '@services/master';

import { DataTableModule, CheckboxModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewWorkspaceComponent, canActivate: [AuthGuard],
        data: { "module": "mst", "submodule": "ws", "rights": "view", "urlname": "/workspace" }
      },
      {
        path: 'profile', component: ViewWorkspaceComponent, canActivate: [AuthGuard],
        data: { "module": "mst", "submodule": "ws", "rights": "view", "urlname": "/workspace" }
      },
      {
        path: 'add', component: AddWorkspaceComponent, canActivate: [AuthGuard],
        data: { "module": "mst", "submodule": "ws", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'details/:id', component: AddWorkspaceComponent, canActivate: [AuthGuard],
        data: { "module": "mst", "submodule": "ws", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'edit/:id', component: AddWorkspaceComponent, canActivate: [AuthGuard],
        data: { "module": "mst", "submodule": "ws", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];


@NgModule({
  declarations: [
    AddWorkspaceComponent,
    ViewWorkspaceComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule,
    AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, CommonService, WorkspaceService, EntityService]
})

export class WorkspaceModule {
  public static routes = routes;
}
