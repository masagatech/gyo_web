import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddTeacherRemarkComponent } from './aded/addtchrrmrk.comp';
import { ViewTeacherRemarkComponent } from './view/viewtchrrmrk.comp';

import { AssignmentService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewTeacherRemarkComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "tr", "rights": "view", "urlname": "/notification" }
      },
      {
        path: 'add', component: AddTeacherRemarkComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "tr", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddTeacherRemarkComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "tr", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddTeacherRemarkComponent,
    ViewTeacherRemarkComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, AssignmentService]
})

export class TeacherRemarkModule {
  public static routes = routes;
}
