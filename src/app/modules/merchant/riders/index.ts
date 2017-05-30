import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddRiderComponent } from './aded/addrdr.comp';
import { ViewRiderComponent } from './view/viewrdr.comp';

import { RiderService } from '../../../_services/merchant/riders/rdr-service';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewRiderComponent },
      { path: 'add', component: AddRiderComponent },
      { path: 'details/:id', component: AddRiderComponent },
      { path: 'edit/:id', component: AddRiderComponent }
    ]
  },
];


@NgModule({
  declarations: [
    AddRiderComponent,
    ViewRiderComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule, AutoCompleteModule
  ],

  providers: [RiderService]
})

export class RidersModule {
  public static routes = routes;
}
