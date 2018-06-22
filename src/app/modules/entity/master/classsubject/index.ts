import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, CommonService } from '@services';

import { AddClassSubjectComponent } from './aded/addclssub.comp';
import { ViewClassSubjectComponent } from './view/viewclssub.comp';

import { ClassService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewClassSubjectComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clssub", "rights": "view", "urlname": "/class" }
      },
      {
        path: 'add', component: AddClassSubjectComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clssub", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddClassSubjectComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clssub", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddClassSubjectComponent,
    ViewClassSubjectComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, CommonService, ClassService]
})

export class ClassSubjectModule {
  public static routes = routes;
}
