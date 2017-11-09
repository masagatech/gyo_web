import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { BooksReportsComponent } from './rptbk.comp';

import { BookService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: BooksReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptmst", "submodule": "rptbk", "rights": "view", "urlname": "/books" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    BooksReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, BookService]
})

export class BooksReportsModule {
  public static routes = routes;
}
