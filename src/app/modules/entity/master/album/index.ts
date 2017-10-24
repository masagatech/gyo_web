import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddAlbumComponent } from './aded/addalbum.comp';
import { ViewAlbumComponent } from './view/viewalbum.comp';

import { GalleryService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, DataGridModule, PanelModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewAlbumComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "album", "rights": "view", "urlname": "/Album" } },
      { path: 'add', component: AddAlbumComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "album", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddAlbumComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "album", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddAlbumComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "album", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddAlbumComponent,
    ViewAlbumComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, DataGridModule, PanelModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, GalleryService]
})

export class AlbumModule {
  public static routes = routes;
}
