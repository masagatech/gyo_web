import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddContentEntityMapComponent } from './addcntenttmap.comp';

import { ContentService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddContentEntityMapComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "cntenttmap", "rights": "view", "urlname": "/contententitymap" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddContentEntityMapComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule,
    DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ContentService]
})

export class ContentEntityMapModule {
  public static routes = routes;
}
