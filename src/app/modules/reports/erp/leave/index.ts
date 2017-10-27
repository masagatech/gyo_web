import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { LeaveReportsComponent } from './rptleave.comp';

import { LeaveService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: LeaveReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptpsngrlv", "rights": "view", "urlname": "/leave" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    LeaveReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule, DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, LeaveService]
})

export class ERPLeaveReportsModule {
  public static routes = routes;
}
