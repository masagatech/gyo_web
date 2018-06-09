import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { AddFeesCollectionComponent } from './aded/addfscoll.comp';
import { ViewFeesCollectionComponent } from './view/viewfscoll.comp';
import { ViewFeesHistoryComponent } from './history/history.comp';

import { NotificationService, FeesService } from '@services/erp';

import { AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewFeesCollectionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feescoll", "rights": "view", "urlname": "/feescollection" }
      },
      {
        path: 'student/add', component: AddFeesCollectionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feescoll", "rights": "add", "urlname": "/student" }
      },
      {
        path: 'student/edit', component: AddFeesCollectionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feescoll", "rights": "edit", "urlname": "/student" }
      },
      {
        path: 'student/history', component: ViewFeesHistoryComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feescoll", "rights": "view", "urlname": "/student" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddFeesCollectionComponent,
    ViewFeesCollectionComponent,
    ViewFeesHistoryComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, NotificationService, FeesService, CommonService]
})

export class FeesCollectionModule {
  public static routes = routes;
}
