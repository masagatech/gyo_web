import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';

import { AddAdmissionComponent } from './aded/addadmsn.comp';
import { ViewAdmissionComponent } from './view/viewadmsn.comp';
import { StudentDashboardComponent } from './dashboard/dashboard.comp';

import { AdmissionService } from '@services/erp';

import {
  LazyLoadEvent, DataTableModule, DataGridModule, PanelModule, CheckboxModule,
  AutoCompleteModule, FileUploadModule
} from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: 'dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "admsn", "rights": "view", "urlname": "dashboard" }
      },
      {
        path: '', redirectTo: 'profile'
      },
      {
        path: 'profile', component: ViewAdmissionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "admsn", "rights": "view", "urlname": "student" }
      },
      {
        path: 'admission', component: AddAdmissionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "admsn", "rights": "add", "urlname": "admission" }
      },
      {
        path: 'edit/:id', component: AddAdmissionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "album", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'details/:id', component: AddAdmissionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "album", "rights": "view", "urlname": "/edit" }
      }
    ]
  },
];


@NgModule({
  declarations: [
    AddAdmissionComponent,
    ViewAdmissionComponent,
    StudentDashboardComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, DataGridModule, PanelModule,
    CheckboxModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, AdmissionService, CommonService]
})

export class AdmissionModule {
  public static routes = routes;
}
