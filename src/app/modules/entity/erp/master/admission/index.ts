import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { AdmissionComponent } from './admission.comp';

import { AdmissionService } from '@services/erp';

import {
  LazyLoadEvent, DataTableModule, DataGridModule, PanelModule, CheckboxModule,
  AutoCompleteModule, FileUploadModule
} from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AdmissionComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "admsn", "rights": "view", "urlname": "admission" }
      },
    ]
  },
];


@NgModule({
  declarations: [
    AdmissionComponent
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
