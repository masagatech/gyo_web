import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { UserReportsComponent } from './rptuser.comp';
import { UserService } from '@services/master';

import { DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: UserReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptusr", "rights": "view", "urlname": "/users" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    UserReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule
  ],

  providers: [AuthGuard, UserService, CommonService]
})

export class UserReportsModule {
  public static routes = routes;
}
