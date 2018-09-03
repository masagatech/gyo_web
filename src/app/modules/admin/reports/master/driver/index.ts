import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { DriverMasterReportsComponent } from './rptdriver.comp';
import { DriverService } from '@services/master';

import { DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: DriverMasterReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptmst", "submodule": "rptdrvmst", "rights": "view", "urlname": "/driver" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    DriverMasterReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, CommonService, DriverService]
})

export class DriverMasterReportsModule {
  public static routes = routes;
}
