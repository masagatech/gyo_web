import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { AddAdmissionComponent } from './aded/addadmsn.comp';
import { ViewAdmissionComponent } from './view/viewadmsn.comp';

import { AdmissionService } from '@services/erp';

import {
  LazyLoadEvent, DataTableModule, DataGridModule, PanelModule, CheckboxModule,
  AutoCompleteModule, FileUploadModule
} from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewAdmissionComponent, canActivate: [AuthGuard],
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
        data: { "module": "erp", "submodule": "album", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];


@NgModule({
  declarations: [
    AddAdmissionComponent,
    ViewAdmissionComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, DataGridModule, PanelModule,
    CheckboxModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, AdmissionService]
})

export class AdmissionModule {
  public static routes = routes;
}
