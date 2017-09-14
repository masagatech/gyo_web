import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddActivityComponent } from './aded/addactv.comp';
import { ViewActivityComponent } from './view/viewactv.comp';

import { ActivityService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewActivityComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "Activity", "rights": "view", "urlname": "/Activity" }
      },
      {
        path: 'add', component: AddActivityComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "Activity", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddActivityComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "Activity", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddActivityComponent,
    ViewActivityComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ActivityService]
})

export class ActivityModule {
  public static routes = routes;
}
