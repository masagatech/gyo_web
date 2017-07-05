import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { DirectPassengerComponent } from './directpsngr.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: DirectPassengerComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "directpsngr", "rights": "view", "urlname": "/directpassenger" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    DirectPassengerComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class DirectPassengerModule {
  public static routes = routes;
}
