import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddLibraryComponent } from './aded/addlibr.comp';
import { ViewLibraryComponent } from './view/viewlibr.comp';

import { LibraryService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewLibraryComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "cls", "rights": "view", "urlname": "/Library" }
      },
      {
        path: 'add', component: AddLibraryComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "cls", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddLibraryComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "cls", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddLibraryComponent,
    ViewLibraryComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, LibraryService]
})

export class LibraryMasterModule {
  public static routes = routes;
}
