import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MarkeingDashboardComponent } from './dashboard.comp';

import { LazyLoadEvent, DataTableModule, ChartModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: MarkeingDashboardComponent },
    ]
  },
];


@NgModule({
  declarations: [
    MarkeingDashboardComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, ChartModule
  ]
})

export class MarketingDashboardModule {
  public static routes = routes;
}
