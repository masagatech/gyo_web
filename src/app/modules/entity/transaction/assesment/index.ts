import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddAssesmentComponent } from './aded/addass.comp';
import { ViewAssesmentComponent } from './view/viewass.comp';

import { AssesmentService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewAssesmentComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "ass", "rights": "view", "urlname": "/assesment" }
      },
      {
        path: 'add', component: AddAssesmentComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "ass", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddAssesmentComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "ass", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddAssesmentComponent,
    ViewAssesmentComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, AssesmentService]
})

export class AssesmentModule {
  public static routes = routes;
}
