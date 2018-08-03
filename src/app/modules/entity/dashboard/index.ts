import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { DashboardComponent } from './dashboard.comp';
import { DashboardService } from '@services';

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

  providers: [AuthGuard, DashboardService]
})

export class DashboardModule {
  public static routes = routes;
}