import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { AnnouncementReportsComponent } from './rptannc.comp';
import { AnnouncementService } from '@services/reports';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AnnouncementReportsComponent, canActivate: [AuthGuard],
        data: { "module": "announcement", "submodule": "rptmnlntf", "rights": "view", "urlname": "/announcement" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AnnouncementReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, AnnouncementService]
})

export class AnnouncementReportsModule {
  public static routes = routes;
}
