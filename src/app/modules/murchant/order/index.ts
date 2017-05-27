import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';

import { CreateOrderComponent } from './create/credord.comp';
import { TrackOrderComponent } from './track/trackord.comp';
import { ViewOrderComponent } from './view/vieword.comp';
import { DataGridModule } from './datagrid';

import { OrderService } from '../../../_services/order/ord-service';

import { LazyLoadEvent, DataTableModule, SelectButtonModule, GMapModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: 'vieworder', component: ViewOrderComponent },
      { path: 'trackorder', component: TrackOrderComponent  },
      { path: 'createorder', component: CreateOrderComponent },
      { path: 'editorder/:id', component: CreateOrderComponent }
    ]
  },
];

@NgModule({
  declarations: [
    CreateOrderComponent,
    TrackOrderComponent,
    ViewOrderComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, SelectButtonModule, GMapModule,
    DataGridModule
  ],

  providers: [OrderService]
})

export class OrderModule {
  public static routes = routes;
}
