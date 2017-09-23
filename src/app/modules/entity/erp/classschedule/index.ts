import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddClassScheduleComponent } from './aded/addcs.comp';
import { ViewClassScheduleComponent } from './view/viewcs.comp';

import { ClassScheduleService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, ScheduleModule, DialogModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewClassScheduleComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clssch", "rights": "view", "urlname": "/classSchedule" }
      },
      {
        path: 'add', component: AddClassScheduleComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clssch", "rights": "add", "urlname": "/add" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AddClassScheduleComponent,
    ViewClassScheduleComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, ScheduleModule, DialogModule
  ],

  providers: [AuthGuard, ClassScheduleService]
})

export class ClassScheduleModule {
  public static routes = routes;
}
