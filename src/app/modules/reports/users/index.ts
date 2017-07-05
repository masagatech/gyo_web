import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { UserReportsComponent } from './rptuser.comp';
import { UserService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

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
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, UserService]
})

export class UserReportsModule {
  public static routes = routes;
}
