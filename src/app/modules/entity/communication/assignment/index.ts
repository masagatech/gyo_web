import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddAssignmentComponent } from './aded/addassnm.comp';
import { ViewAssignmentComponent } from './view/viewassnm.comp';

import { AssignmentService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewAssignmentComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "assnm", "rights": "view", "urlname": "/homework" }
      },
      {
        path: 'add', component: AddAssignmentComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "assnm", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddAssignmentComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "assnm", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddAssignmentComponent,
    ViewAssignmentComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, AssignmentService]
})

export class AssignmentModule {
  public static routes = routes;
}
