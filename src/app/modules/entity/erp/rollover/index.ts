import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { RolloverComponent } from './rollover.comp';

import { AdmissionService } from '@services/erp';

import {
  LazyLoadEvent, DataTableModule, DataGridModule, PanelModule, CheckboxModule,
  AutoCompleteModule, FileUploadModule
} from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: RolloverComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "rollover", "rights": "add", "urlname": "/rollover" }
      }
    ]
  },
];


@NgModule({
  declarations: [
    RolloverComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, DataGridModule, PanelModule,
    CheckboxModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, AdmissionService]
})

export class RolloverModule {
  public static routes = routes;
}
