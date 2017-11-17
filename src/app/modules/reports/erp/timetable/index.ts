import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { TimetableReportsComponent } from './timetable.comp';

import { ClassTimeTableService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TimetableReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptpsngrtmt", "rights": "view", "urlname": "/timetable" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    TimetableReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, AutoCompleteModule
  ],
  
    providers: [AuthGuard, ClassTimeTableService]
})

export class TimetableReportsModule {
  public static routes = routes;
}
