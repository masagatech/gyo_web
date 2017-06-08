import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddWorkspaceComponent } from './aded/addws.comp';
import { ViewWorkspaceComponent } from './view/viewws.comp';

import { WorkspaceService } from '../../_services/workspace/ws-service';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewWorkspaceComponent },
      { path: 'add', component: AddWorkspaceComponent },
      { path: 'details/:id', component: AddWorkspaceComponent },
      { path: 'edit/:id', component: AddWorkspaceComponent }
    ]
  },
];


@NgModule({
  declarations: [
    AddWorkspaceComponent,
    ViewWorkspaceComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule, AutoCompleteModule
  ],

  providers: [WorkspaceService]
})

export class WorkspaceModule {
  public static routes = routes;
}
