import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreateOrderComponent } from './create/credord.comp';
import { ViewOrderComponent } from './view/vieword.comp';

import { OrderService } from '../../../_services/order/ord-service';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: 'vieworder', component: ViewOrderComponent },
      { path: 'createorder', component: CreateOrderComponent },
      { path: 'editorder/:id', component: CreateOrderComponent }
    ]
  },
];

@NgModule({
  declarations: [
    CreateOrderComponent,
    ViewOrderComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [OrderService]
})

export class OrderModule {
  public static routes = routes;
}
