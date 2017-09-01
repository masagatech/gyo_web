import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { AddGeneralComponent } from './addgen.comp';

import { GeneralService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddGeneralComponent, canActivate: [AuthGuard],
        data: { "module": "set", "submodule": "umm", "rights": "allowed", "urlname": "/general" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddGeneralComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    CheckboxModule, AutoCompleteModule
  ],

  providers: [AuthGuard, GeneralService]
})

export class GeneralModule {
  public static routes = routes;
}
