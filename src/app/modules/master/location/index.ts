import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddLocationComponent } from './aded/addloc.comp';
import { ViewLocationComponent } from './view/viewloc.comp';

import { LocationService } from '@services/master';

import { LazyLoadEvent, DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: 'view', component: ViewLocationComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "loc", "rights": "view", "urlname": "/location" } },
      { path: '', component: AddLocationComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "loc", "rights": "view", "urlname": "/location" } },
      { path: 'edit/:id', component: AddLocationComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "loc", "rights": "edit", "urlname": "/edit" } }
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

  providers: [AuthGuard, LocationService]
})

export class LocationModule {
  public static routes = routes;
}
