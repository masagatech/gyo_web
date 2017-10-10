import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddChapterComponent } from './aded/addchptr.comp';
import { ViewChapterComponent } from './view/viewchptr.comp';

import { ChapterService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewChapterComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "chptr", "rights": "view", "urlname": "/chapter" }
      },
      {
        path: 'add', component: AddChapterComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "chptr", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddChapterComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "chptr", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddChapterComponent,
    ViewChapterComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ChapterService]
})

export class ChapterModule {
  public static routes = routes;
}
