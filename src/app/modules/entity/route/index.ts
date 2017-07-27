import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';

import { AddRouteComponent } from './aded/addrt.comp';
import { ViewRouteComponent } from './view/viewrt.comp';

import { RouteService } from '@services/master';

import { LazyLoadEvent, DataTableModule, OrderListModule, AutoCompleteModule, GMapModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewRouteComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "rt", "rights": "view", "urlname": "/route" } },
      { path: 'add', component: AddRouteComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "rt", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddRouteComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "rt", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddRouteComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "rt", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddRouteComponent,
    ViewRouteComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, OrderListModule, AutoCompleteModule, GMapModule],

  providers: [AuthGuard, RouteService]
})

export class RouteModule {
  public static routes = routes;
}
