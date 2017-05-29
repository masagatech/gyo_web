import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddOutletComponent } from './aded/addoutlet.comp';
import { ViewOutletComponent } from './view/viewoutlet.comp';

import { OutletService } from '../../../_services/merchant/outlet/outlet-service';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewOutletComponent },
      { path: 'add', component: AddOutletComponent },
      { path: 'details/:id', component: AddOutletComponent },
      { path: 'edit/:id', component: AddOutletComponent }
    ]
  },
];


@NgModule({
  declarations: [
    AddOutletComponent,
    ViewOutletComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [OutletService]
})

export class OutletModule {
  public static routes = routes;
}
