import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddPassengerComponent } from './aded/addpsngr.comp';
import { ViewPassengerComponent } from './view/viewpsngr.comp';

import { PassengerService } from '../../_services/passenger/psngr-service';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewPassengerComponent },
      { path: 'add', component: AddPassengerComponent },
      { path: 'details/:id', component: AddPassengerComponent },
      { path: 'edit/:id', component: AddPassengerComponent }
    ]
  },
];


@NgModule({
  declarations: [
    AddPassengerComponent,
    ViewPassengerComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule, AutoCompleteModule
  ],

  providers: [PassengerService]
})

export class PassengerModule {
  public static routes = routes;
}
