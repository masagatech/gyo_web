import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../../_services/authguard-service';

import { LoginLogReportsComponent } from './rptlog.comp';
import { UserService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: LoginLogReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptll", "rights": "view", "urlname": "/loginlog" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    LoginLogReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, UserService]
})

export class LoginLogModule {
  public static routes = routes;
}
