import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ViewFeesStructureComponent } from './view/viewfsstrctr.comp';
import { AddFeesStructureComponent } from './aded/addfsstrctr.comp';

import { FeesService } from '@services/erp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewFeesStructureComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feesstrctr", "rights": "view", "urlname": "/feesstructure" }
      },
      {
        path: 'add', component: AddFeesStructureComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feesstrctr", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddFeesStructureComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "feesstrctr", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ViewFeesStructureComponent,
    AddFeesStructureComponent,
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, FeesService]
})

export class FeesStructureModule {
  public static routes = routes;
}
