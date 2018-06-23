import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddSubjectComponent } from './aded/addsub.comp';
import { ViewSubjectComponent } from './view/viewsub.comp';

import { ClassService, SubjectService } from '@services/master';

import { DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewSubjectComponent, canActivate: [AuthGuard],
        data: { "module": "mst", "submodule": "subject", "rights": "view", "urlname": "/subject" }
      },
      {
        path: 'add', component: AddSubjectComponent, canActivate: [AuthGuard],
        data: { "module": "mst", "submodule": "subject", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddSubjectComponent, canActivate: [AuthGuard],
        data: { "module": "mst", "submodule": "subject", "rights": "edit", "urlname": "/edit" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AddSubjectComponent,
    ViewSubjectComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule
  ],

  providers: [AuthGuard, ClassService, SubjectService]
})

export class SubjectModule {
  public static routes = routes;
}
