import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ViewClassFeesComponent } from './view/viewclsfees.comp';
import { AddClassFeesComponent } from './aded/addclsfees.comp';
import { AddInstallmentFeesComponent } from './installment/addinstlfees.comp';

import { FeesService } from '@services/erp';

import { DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewClassFeesComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clsfees", "rights": "view", "urlname": "/classfees" }
      },
      {
        path: 'add', component: AddClassFeesComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clsfees", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddClassFeesComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clsfees", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'installment', component: AddInstallmentFeesComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clsfees", "rights": "add", "urlname": "/installment" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ViewClassFeesComponent,
    AddClassFeesComponent,
    AddInstallmentFeesComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule
  ],

  providers: [AuthGuard, FeesService]
})

export class ClassFeesModule {
  public static routes = routes;
}
