import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { FeesCollectionReportsComponent } from './rptfeescoll.comp';
import { FeesService } from '@services/erp';
import { FeesReportsService } from '@services/reports';

import { LazyLoadEvent, AutoCompleteModule } from 'primeng/primeng';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: FeesCollectionReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptfees", "submodule": "rptfeescoll", "rights": "view", "urlname": "/feescollection" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    FeesCollectionReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    AutoCompleteModule, AngularMultiSelectModule
  ],

  providers: [AuthGuard, FeesService, FeesReportsService, CommonService]
})

export class FeesCollectionReportsModule {
  public static routes = routes;
}
