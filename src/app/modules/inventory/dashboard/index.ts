import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { InventoryService } from '@services/master';

import { DashboardComponent } from './dashboard.comp';
import { ERPDashboardService } from '@services/erp';

import { DataTableModule, DataGridModule, PanelModule, ChartModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: DashboardComponent },
    ]
  },
];

@NgModule({
  declarations: [
    DashboardComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, DataGridModule, PanelModule, ChartModule
  ],

  providers: [AuthGuard, ERPDashboardService, InventoryService]
})

export class DashboardModule {
  public static routes = routes;
}