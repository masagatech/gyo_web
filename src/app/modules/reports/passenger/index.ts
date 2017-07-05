import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { PassengerReportsComponent } from './rptpsngr.comp';
import { PassengerService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: PassengerReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptpsngr", "rights": "view", "urlname": "/passenger" }
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

  providers: [AuthGuard, PassengerService]
})

export class PassengerReportsModule {
  public static routes = routes;
}
