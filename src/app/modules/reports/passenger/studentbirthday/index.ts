import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { StudentBirthdayComponent } from './studsbirth.comp';

import { AdmissionService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: StudentBirthdayComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "dob", "rights": "view", "urlname": "/birthday" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    StudentBirthdayComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, AdmissionService]
})

export class StudentBirthdayModule {
  public static routes = routes;
}
