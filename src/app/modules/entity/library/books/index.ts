import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddLibraryBooksComponent } from './aded/addlibrbk.comp';
import { ViewLibraryBooksComponent } from './view/viewlibrbk.comp';

import { LibraryService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewLibraryBooksComponent, canActivate: [AuthGuard],
        data: { "module": "plibr", "submodule": "books", "rights": "view", "urlname": "/librarybooks" }
      },
      {
        path: 'add', component: AddLibraryBooksComponent, canActivate: [AuthGuard],
        data: { "module": "plibr", "submodule": "books", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddLibraryBooksComponent, canActivate: [AuthGuard],
        data: { "module": "plibr", "submodule": "books", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddLibraryBooksComponent,
    ViewLibraryBooksComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, LibraryService]
})

export class LibraryBooksModule {
  public static routes = routes;
}
