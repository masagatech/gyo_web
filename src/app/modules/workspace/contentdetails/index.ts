import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddContentDetailsComponent } from './aded/addcntdtls.comp';
import { ViewContentDetailsComponent } from './view/viewcntdtls.comp';

import { ContentService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewContentDetailsComponent, canActivate: [AuthGuard],
        data: { "module": "ws", "submodule": "cntdtls", "rights": "view", "urlname": "/contentdetails" }
      },
      {
        path: 'add', component: AddContentDetailsComponent, canActivate: [AuthGuard],
        data: { "module": "ws", "submodule": "cntdtls", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddContentDetailsComponent, canActivate: [AuthGuard],
        data: { "module": "ws", "submodule": "cntdtls", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddContentDetailsComponent,
    ViewContentDetailsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule,
    DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ContentService]
})

export class ContentDetailsModule {
  public static routes = routes;
}
