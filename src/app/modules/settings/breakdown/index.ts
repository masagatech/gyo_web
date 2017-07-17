import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddBreakDownComponent } from './addbds.comp';

import { BreakDownService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AddBreakDownComponent, canActivate: [AuthGuard],
        data: { "module": "set", "submodule": "bds", "rights": "allowed", "urlname": "/breakdown" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddBreakDownComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule,
    CheckboxModule, AutoCompleteModule
  ],

  providers: [AuthGuard, BreakDownService]
})

export class BreakDownModule {
  public static routes = routes;
}
