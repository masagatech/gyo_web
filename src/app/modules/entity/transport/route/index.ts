import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { AddRouteComponent } from './aded/addrt.comp';
import { ViewRouteComponent } from './view/viewrt.comp';

import { RouteService } from '@services/master';

import { GMapModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewRouteComponent, canActivate: [AuthGuard],
        data: { "module": "trnsp", "submodule": "rt", "rights": "view", "urlname": "/route" }
      },
      {
        path: 'add', component: AddRouteComponent, canActivate: [AuthGuard],
        data: { "module": "trnsp", "submodule": "rt", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'details/:id', component: AddRouteComponent, canActivate: [AuthGuard],
        data: { "module": "trnsp", "submodule": "rt", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'edit/:id', component: AddRouteComponent, canActivate: [AuthGuard],
        data: { "module": "trnsp", "submodule": "rt", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddRouteComponent,
    ViewRouteComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), GMapModule
  ],

  providers: [AuthGuard, RouteService, CommonService]
})

export class RouteModule {
  public static routes = routes;
}
