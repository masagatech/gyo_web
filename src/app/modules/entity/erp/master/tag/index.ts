import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddTagComponent } from './aded/addtag.comp';
import { ViewTagComponent } from './view/viewtag.comp';

import { TagService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewTagComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tag", "rights": "view", "urlname": "/tag" } },
      { path: 'add', component: AddTagComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tag", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddTagComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tag", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddTagComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "tag", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddTagComponent,
    ViewTagComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, TagService]
})

export class TagModule {
  public static routes = routes;
}
