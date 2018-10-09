import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, CommonService } from '@services';

import { AddBatchComponent } from './aded/addbatch.comp';
import { ViewBatchComponent } from './view/viewbatch.comp';

import { BatchService } from '@services/master';

import { DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewBatchComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "btc", "rights": "view", "urlname": "/batch" }
      },
      {
        path: 'add', component: AddBatchComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "btc", "rights": "view", "urlname": "/add" }
      },
      {
        path: 'details/:id', component: AddBatchComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "btc", "rights": "view", "urlname": "/edit" }
      },
      {
        path: 'edit/:id', component: AddBatchComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "btc", "rights": "view", "urlname": "/edit" }
      }
    ]
  },
];


@NgModule({
  declarations: [
    AddBatchComponent,
    ViewBatchComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule
  ],

  providers: [AuthGuard, BatchService, CommonService]
})

export class BatchModule {
  public static routes = routes;
}
