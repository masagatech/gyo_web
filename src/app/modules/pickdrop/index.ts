import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ViewPickDropComponent } from './view/viewpickdrop.comp';
import { AddPickDropComponent } from './aded/addpickdrop.comp';

import { PickDropService } from '../../_services/pickdrop/pickdrop-service';

import { LazyLoadEvent, DataTableModule, OrderListModule, PickListModule, AutoCompleteModule } from 'primeng/primeng';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewPickDropComponent },
      { path: 'add', component: AddPickDropComponent },
      { path: 'details/:id', component: AddPickDropComponent },
      { path: 'edit/:id', component: AddPickDropComponent }
    ]
  },
];


@NgModule({
  declarations: [
    ViewPickDropComponent,
    AddPickDropComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, OrderListModule, PickListModule, AutoCompleteModule,
    DropzoneModule.forRoot()
  ],

  providers: [PickDropService]
})

export class PickDropModule {
  public static routes = routes;
}
