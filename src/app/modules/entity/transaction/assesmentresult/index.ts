import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddAssesmentResultComponent } from './aded/addassres.comp';
import { ViewAssesmentResultComponent } from './view/viewassres.comp';

import { AssesmentService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewAssesmentResultComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "assres", "rights": "view", "urlname": "/assesmentresult" }
      },
      {
        path: 'add', component: AddAssesmentResultComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "assres", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit', component: AddAssesmentResultComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "assres", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddAssesmentResultComponent,
    ViewAssesmentResultComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, AssesmentService]
})

export class AssesmentResultModule {
  public static routes = routes;
}
