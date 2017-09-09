import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddNotificationComponent } from './aded/addntf.comp';
import { ViewNotificationComponent } from './view/viewntf.comp';

import { NotificationService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewNotificationComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "ntf", "rights": "view", "urlname": "/notification" }
      },
      {
        path: 'add', component: AddNotificationComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "ntf", "rights": "add", "urlname": "/add" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddNotificationComponent,
    ViewNotificationComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, NotificationService]
})

export class NotificationModule {
  public static routes = routes;
}
