import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddBooksComponent } from './aded/addbk.comp';
import { ViewBooksComponent } from './view/viewbk.comp';

import { BookService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewBooksComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "books", "rights": "view", "urlname": "/books" }
      },
      {
        path: 'add', component: AddBooksComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "books", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddBooksComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "books", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddBooksComponent,
    ViewBooksComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, BookService]
})

export class BooksModule {
  public static routes = routes;
}
