import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ClassScheduleReportsComponent } from './rptclssch.comp';
import { ClassScheduleService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ClassScheduleReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptclssch", "rights": "view", "urlname": "/classschedule" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ClassScheduleReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ClassScheduleService]
})

export class ClassScheduleReportsModule {
  public static routes = routes;
}
