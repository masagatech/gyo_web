import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { StudentFeesReportsComponent } from './rptstudfees.comp';
import { FeesService } from '@services/erp';
import { FeesReportsService } from '@services/reports';

import { AutoCompleteModule } from 'primeng/primeng';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: StudentFeesReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptfees", "submodule": "rptstudfees", "rights": "view", "urlname": "/feescollection" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    StudentFeesReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    AutoCompleteModule, AngularMultiSelectModule
  ],

  providers: [AuthGuard, FeesService, FeesReportsService, CommonService]
})

export class StudentFeesReportsModule {
  public static routes = routes;
}
