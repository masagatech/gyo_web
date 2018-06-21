import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { ViewFeesExcemptionComponent } from './view/viewfsexc.comp';
import { AddFeesExcemptionComponent } from './aded/addfsexc.comp';

import { FeesService } from '@services/erp';

import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewFeesExcemptionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feesexc", "rights": "view", "urlname": "/feesexcemption" }
      },
      {
        path: 'add', component: AddFeesExcemptionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feesexc", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddFeesExcemptionComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feesexc", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ViewFeesExcemptionComponent,
    AddFeesExcemptionComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), AutoCompleteModule
  ],

  providers: [AuthGuard, FeesService, CommonService]
})

export class FeesExcemptionModule {
  public static routes = routes;
}
