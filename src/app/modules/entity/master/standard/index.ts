import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddStandardComponent } from './aded/addstd.comp';
import { ViewStandardComponent } from './view/viewstd.comp';

import { ClassService } from '@services/master';

import { DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewStandardComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "cls", "rights": "view", "urlname": "/standard" }
      },
      {
        path: 'add', component: AddStandardComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "cls", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddStandardComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "cls", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddStandardComponent,
    ViewStandardComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule
  ],

  providers: [AuthGuard, ClassService]
})

export class StandardModule {
  public static routes = routes;
}
