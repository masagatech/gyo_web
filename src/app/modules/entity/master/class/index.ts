import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddClassComponent } from './aded/addclass.comp';
import { ViewClassComponent } from './view/viewclass.comp';

import { ClassService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewClassComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "cls", "rights": "view", "urlname": "/class" }
      },
      {
        path: 'add', component: AddClassComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "cls", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddClassComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "cls", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddClassComponent,
    ViewClassComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ClassService]
})

export class ClassModule {
  public static routes = routes;
}
