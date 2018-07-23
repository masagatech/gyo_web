import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { AdminNotificationReportsComponent } from './rptntf.comp';
import { NotificationService } from '@services/reports';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AdminNotificationReportsComponent, canActivate: [AuthGuard],
        data: { "module": "notification", "submodule": "rptntf", "rights": "view", "urlname": "/notification" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AdminNotificationReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, NotificationService, CommonService]
})

export class AdminNotificationReportsModule {
  public static routes = routes;
}
