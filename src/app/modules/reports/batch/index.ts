import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { BatchReportsComponent } from './rptbatch.comp';
import { BatchService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: BatchReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptbatch", "rights": "view", "urlname": "/batch" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    BatchReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, BatchService]
})

export class BatchReportsModule {
  public static routes = routes;
}
