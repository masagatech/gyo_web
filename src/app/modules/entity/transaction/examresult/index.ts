import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { AddExamResultComponent } from './aded/addexamres.comp';
import { ViewExamResultComponent } from './view/viewexamres.comp';

import { ExamService } from '@services/erp';
import { ExamReportService } from '@services/reports';

import { AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewExamResultComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "examres", "rights": "view", "urlname": "/examresult" }
      },
      {
        path: 'add', component: AddExamResultComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "examres", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddExamResultComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "examres", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddExamResultComponent,
    ViewExamResultComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ExamService, ExamReportService, CommonService]
})

export class ExamResultModule {
  public static routes = routes;
}
