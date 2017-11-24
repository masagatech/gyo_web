import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddLibraryBookIssuedComponent } from './aded/addlbrbkissd.comp';
import { ViewLibraryBookIssuedComponent } from './view/viewlbrbkissd.comp';

import { LibraryService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewLibraryBookIssuedComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "bkissd", "rights": "view", "urlname": "/bookissued" }
      },
      {
        path: 'add', component: AddLibraryBookIssuedComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "bkissd", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddLibraryBookIssuedComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "bkissd", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddLibraryBookIssuedComponent,
    ViewLibraryBookIssuedComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule,
    DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, LibraryService]
})

export class LibraryBookIssuedModule {
  public static routes = routes;
}
