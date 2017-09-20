import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { ClassReportsComponent } from './rptclass.comp';
import { ClassService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ClassReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptcls", "rights": "view", "urlname": "/class" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ClassReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ClassService]
})

export class ClassReportsModule {
  public static routes = routes;
}
