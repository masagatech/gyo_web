import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { UserReportsComponent } from './rptuser.comp';

import { ReportsService } from '@services/reports';
import { UserService } from '@services/master';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: UserReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptmst", "submodule": "rptusr", "rights": "view", "urlname": "/users" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    UserReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, UserService, ReportsService, CommonService]
})

export class UserReportsModule {
  public static routes = routes;
}
