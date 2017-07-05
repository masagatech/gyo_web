import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { RouteReportsComponent } from './rptroute.comp';
import { RouteService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: RouteReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptroute", "rights": "view", "urlname": "/route" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    RouteReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, RouteService]
})

export class RouteReportsModule {
  public static routes = routes;
}
