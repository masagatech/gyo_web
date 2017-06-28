import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { ReportsComponent } from './report.comp';

import { LazyLoadEvent, DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ReportsComponent, canActivate: [AuthGuard],
        data: { "module": "mrktn", "submodule": "mrktnrpt", "rights": "view", "urlname": "/reports" }
      },
    ]
  },
];


@NgModule({
  declarations: [
    ReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule
  ],

  providers: [AuthGuard]
})

export class MarketingReportsModule {
  public static routes = routes;
}
