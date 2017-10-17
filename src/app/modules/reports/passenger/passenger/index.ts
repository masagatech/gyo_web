import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { PassengerReportsComponent } from './rptpsngr.comp';
import { AdmissionService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: PassengerReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptpsngrmst", "rights": "view", "urlname": "/passenger" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    PassengerReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, AdmissionService]
})

export class PassengerReportsModule {
  public static routes = routes;
}
