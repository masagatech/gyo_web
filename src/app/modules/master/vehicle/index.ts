import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddVehicleComponent } from './aded/addveh.comp';
import { ViewVehicleComponent } from './view/viewveh.comp';

import { VehicleService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewVehicleComponent },
      { path: 'add', component: AddVehicleComponent },
      { path: 'details/:id', component: AddVehicleComponent },
      { path: 'edit/:id', component: AddVehicleComponent }
    ]
  },
];

@NgModule({
  declarations: [
    AddVehicleComponent,
    ViewVehicleComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [VehicleService]
})

export class VehicleModule {
  public static routes = routes;
}
