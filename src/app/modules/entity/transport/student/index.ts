import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddStudentVehicleComponent } from './addstudsveh.comp';

import { AdmissionService } from '@services/erp';

import {
  LazyLoadEvent, DataTableModule, DataGridModule, PanelModule, CheckboxModule,
  AutoCompleteModule, FileUploadModule
} from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddStudentVehicleComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "psngr", "rights": "add", "urlname": "/add" }
      }
    ]
  },
];


@NgModule({
  declarations: [
    AddStudentVehicleComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, DataGridModule, PanelModule,
    CheckboxModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, AdmissionService]
})

export class StudentVehicleModule {
  public static routes = routes;
}
