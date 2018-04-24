import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddNoticeboardComponent } from './aded/addnb.comp';
import { ViewNoticeboardComponent } from './view/viewnb.comp';

import { NoticeboardService } from '@services/erp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewNoticeboardComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "psngrnb", "rights": "view", "urlname": "/noticeboard" }
      },
      {
        path: 'add', component: AddNoticeboardComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "psngrnb", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddNoticeboardComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "psngrnb", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddNoticeboardComponent,
    ViewNoticeboardComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, NoticeboardService]
})

export class NoticeboardModule {
  public static routes = routes;
}
