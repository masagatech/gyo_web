import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { AddEntityComponent } from './aded/addentity.comp';
import { ViewEntityComponent } from './view/viewentity.comp';

import { EntityService, WorkspaceService } from '@services/master';

import {
  DataTableModule, DataGridModule, PanelModule, AutoCompleteModule, FileUploadModule, TabViewModule
} from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewEntityComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "entt", "rights": "view", "urlname": "/entity" }
      },
      {
        path: 'add', component: AddEntityComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "entt", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'details/:id', component: AddEntityComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "entt", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'edit/:id', component: AddEntityComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "entt", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddEntityComponent,
    ViewEntityComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    DataGridModule, PanelModule, AutoCompleteModule, FileUploadModule, TabViewModule
  ],

  providers: [AuthGuard, EntityService, WorkspaceService, CommonService]
})

export class EntityModule {
  public static routes = routes;
}
