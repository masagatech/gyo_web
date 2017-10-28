import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { TimetableComponent } from './timetable.comp';

import { ClassScheduleService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TimetableComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "psngrtmt", "rights": "view", "urlname": "/timetable" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    TimetableComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, AutoCompleteModule
  ],
  
    providers: [AuthGuard, ClassScheduleService]
})

export class TimetableModule {
  public static routes = routes;
}
