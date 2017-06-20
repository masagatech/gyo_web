import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../_shared/sharedcomp.module';

import { AddWorkspaceComponent } from './aded/addws.comp';
import { ViewWorkspaceComponent } from './view/viewws.comp';

import { WorkspaceService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

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
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule,
    AutoCompleteModule, FileUploadModule
  ],

  providers: [WorkspaceService]
})

export class WorkspaceModule {
  public static routes = routes;
}
