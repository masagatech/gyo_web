import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { HolidayComponent } from './Holiday.comp';

import { HolidayService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: HolidayComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "psngrhld", "rights": "view", "urlname": "/holiday" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    HolidayComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, AutoCompleteModule
  ],
  
    providers: [AuthGuard, HolidayService]
})

export class HolidayModule {
  public static routes = routes;
}
