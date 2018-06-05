import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddExamComponent } from './aded/addexam.comp';
import { ViewExamComponent } from './view/viewexam.comp';

import { ExamService } from '@services/erp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewExamComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "exam", "rights": "view", "urlname": "/exam" }
      },
      {
        path: 'add', component: AddExamComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "exam", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddExamComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "exam", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddExamComponent,
    ViewExamComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, ExamService]
})

export class ExamModule {
  public static routes = routes;
}
