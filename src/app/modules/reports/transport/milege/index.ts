import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { MilegeReportsComponent } from './rptmilege.comp';
import { MilegeService } from '@services/master';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: MilegeReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptmilege", "rights": "view", "urlname": "/milege" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    MilegeReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, MilegeService]
})

export class MilegeReportsModule {
  public static routes = routes;
}
