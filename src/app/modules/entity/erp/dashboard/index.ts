import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { ERPDashboardComponent } from './dashboard.comp';
import { ERPDashboardService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, DataGridModule, PanelModule, ChartModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ERPDashboardComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "erpdb", "rights": "view", "urlname": "/dashboard" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    ERPDashboardComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, DataGridModule, PanelModule, ChartModule
  ],

  providers: [AuthGuard, ERPDashboardService]
})

export class ERPDashboardModule {
  public static routes = routes;
}
