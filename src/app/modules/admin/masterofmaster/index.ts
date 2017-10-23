import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ViewMOMComponent } from './view/viewmom.comp';
import { AddMOMComponent } from './aded/addmom.comp';

import { LazyLoadEvent, DataTableModule, DataListModule } from 'primeng/primeng';

export const routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '', children: [
          {
            path: '', component: ViewMOMComponent, canActivateChid: [AuthGuard],
            data: { "module": "set", "submodule": "mom", "rights": "view", "urlname": "/other" }
          },

          // Master

          {
            path: 'other/:grpcd', component: ViewMOMComponent, canActivateChid: [AuthGuard],
            data: { "module": "set", "submodule": "mom", "rights": "view", "urlname": "/group" }
          },
          {
            path: 'other/:grpcd/add', component: AddMOMComponent, canActivateChid: [AuthGuard],
            data: { "module": "set", "submodule": "mom", "rights": "add", "urlname": "/add" }
          },
          {
            path: 'other/:grpcd/edit/:id', component: AddMOMComponent, canActivateChid: [AuthGuard],
            data: { "module": "set", "submodule": "mom", "rights": "edit", "urlname": "/edit" }
          },

          // Admin

          {
            path: 'master/:grpcd', component: ViewMOMComponent, canActivateChid: [AuthGuard],
            data: { "module": "set", "submodule": "mom", "rights": "view", "urlname": "/group" }
          },
          {
            path: 'master/:grpcd/add', component: AddMOMComponent, canActivateChid: [AuthGuard],
            data: { "module": "set", "submodule": "mom", "rights": "add", "urlname": "/add" }
          },
          {
            path: 'master/:grpcd/edit/:id', component: AddMOMComponent, canActivateChid: [AuthGuard],
            data: { "module": "set", "submodule": "mom", "rights": "edit", "urlname": "/edit" }
          },
        ]
      }
    ]
  },
]

@NgModule({
  declarations: [
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
