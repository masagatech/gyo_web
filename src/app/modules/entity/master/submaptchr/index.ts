import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { AddSubjectMapToTeacherComponent } from './aded/addsmt.comp';
import { ViewSubjectMapToTeacherComponent } from './view/viewsmt.comp';

import { SubjectMapToTeacherService } from '@services/master';

import { DataTableModule, AutoCompleteModule } from 'primeng/primeng';

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
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, SubjectMapToTeacherService, CommonService]
})

export class SubjectMapToTeacherModule {
  public static routes = routes;
}
