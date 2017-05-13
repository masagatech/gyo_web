import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ReportsComponent } from './report.comp';

import { LazyLoadEvent, DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ReportsComponent },
    ]
  },
];


@NgModule({
  declarations: [
    ReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule
  ]
})

export class ReportsModule {
  public static routes = routes;
}
