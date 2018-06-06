import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ChangeStandardComponent } from './chstd.comp';

import { AdmissionService } from '@services/erp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ChangeStandardComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "chstd", "rights": "add", "urlname": "/changestandard" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ChangeStandardComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, AdmissionService]
})

export class ChangeStandardModule {
  public static routes = routes;
}
