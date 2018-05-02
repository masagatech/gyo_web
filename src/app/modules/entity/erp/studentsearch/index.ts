import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { NvD3Module } from 'ng2-nvd3';

import { StudentSearchComponent } from './studsearch.comp';
import { ERPDashboardService } from '@services/erp';
import { AssesmentReportService } from '@services/reports';

import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: StudentSearchComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "studsearch", "rights": "allowed", "urlname": "/studentsearch" }
      }
    ]
  },
];


@NgModule({
  declarations: [
    StudentSearchComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), AutoCompleteModule, NvD3Module
  ],

  providers: [AuthGuard, ERPDashboardService, AssesmentReportService, CommonService]
})

export class StudentSearchModule {
  public static routes = routes;
}
