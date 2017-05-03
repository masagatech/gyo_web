import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddOwnerComponent } from './aded/addowner.comp';
import { ViewOwnerComponent } from './view/viewowner.comp';

import { OwnerService } from '../../_services/owner/owner-service';

import { LazyLoadEvent, DataTableModule, RadioButtonModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewOwnerComponent },
      { path: 'add', component: AddOwnerComponent },
      { path: 'details/:id', component: AddOwnerComponent },
      { path: 'edit/:id', component: AddOwnerComponent }
    ]
  },
];

@NgModule({
  declarations: [
    AddOwnerComponent,
    ViewOwnerComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, RadioButtonModule, AutoCompleteModule
  ],

  providers: [OwnerService]
})

export class OwnerModule {
  public static routes = routes;
}
