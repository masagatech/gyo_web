import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { HolidayReportsComponent } from './holiday.comp';

import { HolidayService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: HolidayReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptpsngrhld", "rights": "view", "urlname": "/holiday" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    HolidayReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, AutoCompleteModule
  ],
  
    providers: [AuthGuard, HolidayService]
})

export class HolidayReportsModule {
  public static routes = routes;
}
