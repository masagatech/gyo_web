import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, CommonService } from '@services';

import { AddTransportNotificationComponent } from './aded/addntf.comp';
import { ViewTransportNotificationComponent } from './view/viewntf.comp';

import { NotificationService } from '@services/erp';

export const routes = [
  {
    path: '', children: [
      {
        path: 'view', component: ViewTransportNotificationComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "trnspntf", "rights": "view", "urlname": "/notification" }
      },
      {
        path: '', component: AddTransportNotificationComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "trnspntf", "rights": "add", "urlname": "/add" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddTransportNotificationComponent,
    ViewTransportNotificationComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, CommonService, NotificationService]
})

export class TransportNotificationModule {
  public static routes = routes;
}
