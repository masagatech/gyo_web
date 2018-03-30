import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { NotificationReportsComponent } from './rptntf.comp';
import { NotificationService } from '@services/reports';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: NotificationReportsComponent, canActivate: [AuthGuard],
        data: { "module": "notification", "submodule": "rptmnlntf", "rights": "view", "urlname": "/notification" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    NotificationReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, NotificationService]
})

export class NotificationReportsModule {
  public static routes = routes;
}
