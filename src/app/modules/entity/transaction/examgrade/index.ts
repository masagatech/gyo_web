import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddExamGradeComponent } from './aded/addexgrd.comp';
import { ViewExamGradeComponent } from './view/viewexgrd.comp';

import { ExamService } from '@services/erp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewExamGradeComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "exgrd", "rights": "view", "urlname": "/exam" }
      },
      {
        path: 'add', component: AddExamGradeComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "exgrd", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddExamGradeComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "exgrd", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddExamGradeComponent,
    ViewExamGradeComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, ExamService]
})

export class ExamGradeModule {
  public static routes = routes;
}
