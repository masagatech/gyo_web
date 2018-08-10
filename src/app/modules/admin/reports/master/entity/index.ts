import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard, CommonService } from '@services';
import {  } from '@services';

import { EntityReportsComponent } from './rptentity.comp';
import { EntityService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: EntityReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptentt", "rights": "view", "urlname": "/entity" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    EntityReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, EntityService, CommonService]
})

export class EntityReportsModule {
  public static routes = routes;
}
