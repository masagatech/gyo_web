import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddEntityComponent } from './aded/addentity.comp';
import { ViewEntityComponent } from './view/viewentity.comp';

import { EntityService } from '@services/master';

import { OnlyNumber } from '@directives';

import { LazyLoadEvent, DataTableModule, CheckboxModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewEntityComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "entt", "rights": "view", "urlname": "/entity" } },
      { path: 'add', component: AddEntityComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "entt", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddEntityComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "entt", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddEntityComponent, canActivate: [AuthGuard], data: { "module": "mst", "submodule": "entt", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddEntityComponent,
    ViewEntityComponent,
    OnlyNumber
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule, FileUploadModule
  ],

  providers: [AuthGuard, EntityService]
})

export class EntityModule {
  public static routes = routes;
}
