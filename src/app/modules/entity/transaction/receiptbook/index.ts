import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ViewReceiptBookComponent } from './view/viewrb.comp';
import { AddReceiptBookComponent } from './aded/addrb.comp';

import { ReceiptBookService } from '@services/erp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewReceiptBookComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "rb", "rights": "view", "urlname": "/receiptbook" }
      },
      {
        path: 'add', component: AddReceiptBookComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "rb", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddReceiptBookComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "rb", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ViewReceiptBookComponent,
    AddReceiptBookComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, ReceiptBookService]
})

export class ReceiptBookModule {
  public static routes = routes;
}
