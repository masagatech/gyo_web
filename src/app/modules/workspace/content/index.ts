import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddContentComponent } from './aded/addcontent.comp';
import { ViewContentComponent } from './view/viewcontent.comp';

import { ContentService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewContentComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "cls", "rights": "view", "urlname": "/content" }
      },
      {
        path: 'add', component: AddContentComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "cls", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddContentComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "cls", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ViewContentComponent,
    AddContentComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ContentService]
})

export class ContentModule {
  public static routes = routes;
}
