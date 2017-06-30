import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../_shared/sharedcomp.module';
import { AuthGuard } from '../../_services/authguard-service';

import { AddWorkspaceComponent } from './aded/addws.comp';
import { ViewWorkspaceComponent } from './view/viewws.comp';

import { WorkspaceService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewWorkspaceComponent, canActivate: [AuthGuard], data: { "module": "", "submodule": "ws", "rights": "view", "urlname": "/workspace" } },
      { path: 'add', component: AddWorkspaceComponent, canActivate: [AuthGuard], data: { "module": "", "submodule": "ws", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddWorkspaceComponent, canActivate: [AuthGuard], data: { "module": "", "submodule": "ws", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddWorkspaceComponent, canActivate: [AuthGuard], data: { "module": "", "submodule": "ws", "rights": "edit", "urlname": "/edit" } }
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

  providers: [AuthGuard, WorkspaceService]
})

export class WorkspaceModule {
  public static routes = routes;
}
