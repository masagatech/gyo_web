import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ClassRosterReportsComponent } from './rptclsrst.comp';
import { ClassRosterService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ClassRosterReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptclsrst", "rights": "view", "urlname": "/classroster" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ClassRosterReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ClassRosterService]
})

export class ClassRosterReportsModule {
  public static routes = routes;
}
