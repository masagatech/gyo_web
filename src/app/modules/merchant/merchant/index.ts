import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddMerchantComponent } from './aded/addmrcht.comp';
import { ViewMerchantComponent } from './view/viewmrcht.comp';

import { MerchantService } from '../../../_services/merchant/merchant/mrcht-service';

import { LazyLoadEvent, DataTableModule, RadioButtonModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewMerchantComponent },
      { path: 'add', component: AddMerchantComponent },
      { path: 'details/:id', component: AddMerchantComponent },
      { path: 'edit/:id', component: AddMerchantComponent }
    ]
  },
];

@NgModule({
  declarations: [
    AddMerchantComponent,
    ViewMerchantComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, RadioButtonModule
  ],

  providers: [MerchantService]
})

export class MerchantModule {
  public static routes = routes;
}