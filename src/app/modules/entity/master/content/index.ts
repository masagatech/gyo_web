import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { EntityContentComponent } from './content.comp';

import { ContentService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: EntityContentComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "cntenttmap", "rights": "view", "urlname": "/content" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    EntityContentComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ContentService]
})

export class EntityContentModule {
  public static routes = routes;
}
