import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { PassengerLeaveReportsComponent } from './rptpsngrlv.comp';

import { PassengerLeaveService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: PassengerLeaveReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptpsngrlv", "rights": "view", "urlname": "/leave" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    PassengerLeaveReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule, DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, PassengerLeaveService]
})

export class PassengerLeaveModule {
  public static routes = routes;
}
