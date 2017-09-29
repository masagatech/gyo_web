import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddClassFeesComponent } from './aded/addclsfs.comp';

import { FeesService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddClassFeesComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clsfees", "rights": "view", "urlname": "/classfees" }
      },
      {
        path: 'add', component: AddClassFeesComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clsfees", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddClassFeesComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clsfees", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddClassFeesComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, FeesService]
})

export class ClassFeesModule {
  public static routes = routes;
}
