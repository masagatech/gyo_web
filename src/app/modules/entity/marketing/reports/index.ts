import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { MarketingReportsComponent } from './report.comp';
import { DashboardService } from '@services';

import { LazyLoadEvent, DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: MarketingReportsComponent, canActivate: [AuthGuard],
        data: { "module": "mrktn", "submodule": "mrktnrpt", "rights": "view", "urlname": "/reports" }
      },
    ]
  },
];


@NgModule({
  declarations: [
    MarketingReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule
  ],

  providers: [AuthGuard, DashboardService]
})

export class MarketingReportsModule {
  public static routes = routes;
}
