import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { DriverReportsComponent } from './rptdriver.comp';
import { DriverService } from '@services/master';

import { DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: DriverReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpttrnsp", "submodule": "rptdrvtrnsp", "rights": "view", "urlname": "/driver" }
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

  providers: [AuthGuard, CommonService, DriverService]
})

export class DriverReportsModule {
  public static routes = routes;
}
