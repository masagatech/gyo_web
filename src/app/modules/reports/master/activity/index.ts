import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ActivityReportsComponent } from './rptactv.comp';

import { ActivityService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ActivityReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptmst", "submodule": "rptbk", "rights": "view", "urlname": "/activity" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ActivityReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ActivityService]
})

export class ActivityReportsModule {
  public static routes = routes;
}
