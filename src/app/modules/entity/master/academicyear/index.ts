import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddAcademicYearComponent } from './aded/addacdmc.comp';
import { ViewAcademicYearComponent } from './view/viewacdmc.comp';

import { AcademicYearService } from '@services/erp';

import { LazyLoadEvent, DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewAcademicYearComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "acdmc", "rights": "view", "urlname": "/academicyear" }
      },
      {
        path: 'add', component: AddAcademicYearComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "acdmc", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddAcademicYearComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "acdmc", "rights": "edit", "urlname": "/edit" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AddAcademicYearComponent,
    ViewAcademicYearComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule
  ],

  providers: [AuthGuard, AcademicYearService]
})

export class AcademicYearModule {
  public static routes = routes;
}
