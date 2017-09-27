import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { AlbumReportsComponent } from './album/rptab.comp';
import { GalleryReportsComponent } from './gallery/rptglr.comp';
import { GalleryService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, DataGridModule, PanelModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AlbumReportsComponent, canActivate: [AuthGuard],
        data: { "module": "gallery", "submodule": "rptglr", "rights": "view", "urlname": "/gallery" }
      },
      {
        path: 'album/:id', component: GalleryReportsComponent, canActivate: [AuthGuard],
        data: { "module": "gallery", "submodule": "rptglr", "rights": "view", "urlname": "/album" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AlbumReportsComponent,
    GalleryReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, DataGridModule,
    PanelModule, AutoCompleteModule
  ],

  providers: [AuthGuard, GalleryService]
})

export class GalleryReportsModule {
  public static routes = routes;
}
