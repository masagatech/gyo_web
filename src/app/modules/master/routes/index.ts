import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';

import { AddRoutesComponent } from './aded/addrt.comp';
import { ViewRoutesComponent } from './view/viewrt.comp';

import { RoutesService } from '@services/master';

import { LazyLoadEvent, DataTableModule, OrderListModule, AutoCompleteModule, GMapModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewRoutesComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "rt", "rights": "view", "urlname": "/routes" } },
      { path: 'add', component: AddRoutesComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "rt", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddRoutesComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "rt", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddRoutesComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "rt", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddRoutesComponent,
    ViewRoutesComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, OrderListModule, AutoCompleteModule, GMapModule],

  providers: [AuthGuard, RoutesService]
})

export class RoutesModule {
  public static routes = routes;
}
