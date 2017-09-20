import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddSubjectMapToTeacherComponent } from './aded/addsmt.comp';
import { ViewSubjectMapToTeacherComponent } from './view/viewsmt.comp';

import { SubjectMapToTeacherService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewSubjectMapToTeacherComponent, canActivate: [AuthGuard],
        data: { "module": "mst", "submodule": "submaptchr", "rights": "view", "urlname": "/class" }
      },
      {
        path: 'add', component: AddSubjectMapToTeacherComponent, canActivate: [AuthGuard],
        data: { "module": "mst", "submodule": "submaptchr", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddSubjectMapToTeacherComponent, canActivate: [AuthGuard],
        data: { "module": "mst", "submodule": "submaptchr", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddSubjectMapToTeacherComponent,
    ViewSubjectMapToTeacherComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, SubjectMapToTeacherService]
})

export class SubjectMapToTeacherModule {
  public static routes = routes;
}
