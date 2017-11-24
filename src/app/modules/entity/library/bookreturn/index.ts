import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { BookReturnComponent } from './bkret.comp';

import { LibraryService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: BookReturnComponent, canActivate: [AuthGuard],
        data: { "module": "plibr", "submodule": "books", "rights": "view", "urlname": "/librarybooks" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    BookReturnComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, LibraryService]
})

export class LibraryBookReturnModule {
  public static routes = routes;
}
