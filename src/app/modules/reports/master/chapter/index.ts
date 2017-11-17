import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ChapterReportsComponent } from './rptchptr.comp';

import { ChapterService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ChapterReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptmast", "submodule": "rptchptr", "rights": "view", "urlname": "/chapter" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ChapterReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ChapterService]
})

export class ChapterReportsModule {
  public static routes = routes;
}
