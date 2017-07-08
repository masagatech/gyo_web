import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { SpeedReportsComponent } from './rptspeed.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: SpeedReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptspd", "rights": "view", "urlname": "/speed" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    SpeedReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class SpeedReportsModule {
  public static routes = routes;
}
