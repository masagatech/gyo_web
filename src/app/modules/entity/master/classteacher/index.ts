import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, CommonService } from '@services';

import { AddClassTeacherComponent } from './aded/addclstchr.comp';
import { ViewClassTeacherComponent } from './view/viewclstchr.comp';

import { ClassService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewClassTeacherComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clstchr", "rights": "view", "urlname": "/class" }
      },
      {
        path: 'add', component: AddClassTeacherComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clstchr", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddClassTeacherComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clstchr", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddClassTeacherComponent,
    ViewClassTeacherComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, CommonService, ClassService]
})

export class ClassTeacherModule {
  public static routes = routes;
}
