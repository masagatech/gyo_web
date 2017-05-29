import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';

import { ViewComponent } from './view/view.comp';
import { OrderService } from '@services/merchant'

import { LazyLoadEvent, DataTableModule, SelectButtonModule, GMapModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewComponent },
    ]
  },
];

@NgModule({
  declarations: [
    ViewComponent
  ],

  imports: [
    CommonModule, FormsModule,
     SharedComponentModule,
      RouterModule.forChild(routes), 
      DataTableModule,
     SelectButtonModule, GMapModule
  ],

  providers: [OrderService]
})

export class OrderDashboardModule {
  
}
