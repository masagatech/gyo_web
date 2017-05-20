import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddDriverComponent } from './aded/adddriver.comp';
import { ViewDriverComponent } from './view/viewdriver.comp';

import { DriverService } from '../../_services/driver/driver-service';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewDriverComponent },
      { path: 'add', component: AddDriverComponent },
      { path: 'details/:id', component: AddDriverComponent },
      { path: 'edit/:id', component: AddDriverComponent }
    ]
  },
];

@NgModule({
  declarations: [
    AddDriverComponent,
    ViewDriverComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [DriverService]
})

export class DriverModule {
  public static routes = routes;
}
