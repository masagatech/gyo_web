import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';

import { AddRoutesComponent } from './aded/addrt.comp';
import { ViewRoutesComponent } from './view/viewrt.comp';

import { RoutesService } from '@services/master';

import { LazyLoadEvent, DataTableModule, OrderListModule, AutoCompleteModule, GMapModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewRoutesComponent },
      { path: 'add', component: AddRoutesComponent },
      { path: 'edit/:id', component: AddRoutesComponent }
    ]
  },
];

@NgModule({
  declarations: [
    AddRoutesComponent,
    ViewRoutesComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, OrderListModule, AutoCompleteModule, GMapModule],

  providers: [RoutesService]
})

export class RoutesModule {
  public static routes = routes;
}
