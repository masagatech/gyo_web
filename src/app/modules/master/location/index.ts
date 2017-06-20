import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddLocationComponent } from './aded/addloc.comp';
import { ViewLocationComponent } from './view/viewloc.comp';

import { LocationService } from '@services/master';

import { LazyLoadEvent, DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewLocationComponent },
      { path: 'add', component: AddLocationComponent },
      { path: 'edit/:id', component: AddLocationComponent }
    ]
  },
];

@NgModule({
  declarations: [
    AddLocationComponent,
    ViewLocationComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule
  ],

  providers: [LocationService]
})

export class LocationModule {
  public static routes = routes;
}
