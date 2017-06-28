import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { MarkeingDashboardComponent } from './dashboard.comp';

import { LazyLoadEvent, DataTableModule, ChartModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: MarkeingDashboardComponent, canActivate: [AuthGuard],
        data: { "module": "mrktn", "submodule": "mrktndb", "rights": "view", "urlname": "/dashboard" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    MarkeingDashboardComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, ChartModule
  ],

  providers: [AuthGuard]
})

export class MarketingDashboardModule {
  public static routes = routes;
}
