import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { DriverReportsComponent } from './rptdriver.comp';
import { DriverService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: DriverReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptdrv", "rights": "view", "urlname": "/driver" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    DriverReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, DriverService]
})

export class DriverReportsModule {
  public static routes = routes;
}
