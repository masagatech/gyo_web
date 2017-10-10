import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddFeesCollectionComponent } from './aded/addfeescoll.comp';

import { FeesService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddFeesCollectionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feescoll", "rights": "view", "urlname": "/feescollection" }
      },
      {
        path: 'add', component: AddFeesCollectionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feescoll", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddFeesCollectionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feescoll", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddFeesCollectionComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, FeesService]
})

export class FeesCollectionModule {
  public static routes = routes;
}
