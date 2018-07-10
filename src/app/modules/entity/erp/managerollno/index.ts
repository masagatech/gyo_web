import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ManageRollnoComponent } from './mngrlno.comp';

import { AdmissionService } from '@services/erp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ManageRollnoComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "chstd", "rights": "add", "urlname": "/managerollno" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ManageRollnoComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, AdmissionService]
})

export class ManageRollnoModule {
  public static routes = routes;
}
