import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { AddStudentVehicleComponent } from './addstudsveh.comp';

import { AdmissionService } from '@services/erp';

import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddStudentVehicleComponent, canActivate: [AuthGuard],
        data: { "module": "trnsp", "submodule": "svh", "rights": "add", "urlname": "/add" }
      }
    ]
  },
];


@NgModule({
  declarations: [
    AddStudentVehicleComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), AutoCompleteModule
  ],

  providers: [AuthGuard, AdmissionService, CommonService]
})

export class StudentVehicleModule {
  public static routes = routes;
}
