import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddQualificationComponent } from './aded/addqlf.comp';
import { ViewQualificationComponent } from './view/viewqlf.comp';

import { QualificationService } from '@services/master';

import { LazyLoadEvent, DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewQualificationComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "qlf", "rights": "view", "urlname": "/qualification" }
      },
      {
        path: 'add', component: AddQualificationComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "qlf", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddQualificationComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "qlf", "rights": "edit", "urlname": "/edit" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AddQualificationComponent,
    ViewQualificationComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule
  ],

  providers: [AuthGuard, QualificationService]
})

export class QualificationModule {
  public static routes = routes;
}
