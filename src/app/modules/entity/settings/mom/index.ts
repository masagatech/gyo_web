import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { MOMComponent } from './mom.comp';
import { ViewMOMComponent } from './view/viewmom.comp';
import { AddMOMComponent } from './aded/addmom.comp';

import { LazyLoadEvent, DataTableModule, DataListModule } from 'primeng/primeng';

export const routes = [
  {
    path: '',
    component: MOMComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          {
            path: '', component: ViewMOMComponent, canActivateChid: [AuthGuard],
            data: { "module": "set", "submodule": "mom", "rights": "view", "urlname": "/masterofmaster" }
          },
          {
            path: 'group/:grpcd', component: ViewMOMComponent, canActivateChid: [AuthGuard],
            data: { "module": "set", "submodule": "mom", "rights": "view", "urlname": "/group" }
          },
          {
            path: 'group/:grpcd/add', component: AddMOMComponent, canActivateChid: [AuthGuard],
            data: { "module": "set", "submodule": "mom", "rights": "add", "urlname": "/add" }
          },
          {
            path: 'group/:grpcd/edit/:id', component: AddMOMComponent, canActivateChid: [AuthGuard],
            data: { "module": "set", "submodule": "mom", "rights": "edit", "urlname": "/edit" }
          },
        ]
      }
    ]
  },
]

@NgModule({
  declarations: [
    MOMComponent,
    ViewMOMComponent,
    AddMOMComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, DataListModule
  ],

  providers: [AuthGuard]
})

export class MOMModule {
  public static routes = routes;
}
