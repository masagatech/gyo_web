import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';

import { AddStopsComponent } from './aded/addstops.comp';
import { ViewStopsComponent } from './view/viewstops.comp';

import { StopsService } from '../../../_services/stops/stp-service';

import { LazyLoadEvent, DataTableModule, OrderListModule,GMapModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewStopsComponent },
      { path: 'add', component: AddStopsComponent },
      { path: 'edit/:id', component: AddStopsComponent }
    ]
  },
];

@NgModule({
  declarations: [
    AddStopsComponent,
    ViewStopsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, OrderListModule
  ,GMapModule],

  providers: [StopsService]
})

export class StopsModule {
  public static routes = routes;
}
