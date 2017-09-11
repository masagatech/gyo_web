import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddAnnouncementComponent } from './aded/addannc.comp';
import { ViewAnnouncementComponent } from './view/viewannc.comp';

import { AnnouncementService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewAnnouncementComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "annc", "rights": "view", "urlname": "/announcement" }
      },
      {
        path: 'add', component: AddAnnouncementComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "annc", "rights": "add", "urlname": "/add" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddAnnouncementComponent,
    ViewAnnouncementComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, AnnouncementService]
})

export class AnnouncementModule {
  public static routes = routes;
}
