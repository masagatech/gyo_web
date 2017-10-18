import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { StudentReportsComponent } from './rptstuds.comp';
import { AdmissionService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: StudentReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptstudmst", "rights": "view", "urlname": "/student" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    StudentReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, AdmissionService]
})

export class StudentReportsModule {
  public static routes = routes;
}
