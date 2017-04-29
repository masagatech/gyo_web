import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.comp';

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
    CommonModule, FormsModule, RouterModule.forChild(routes)
  ]
})

export class DashboardModule {
  public static routes = routes;
}
