import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddClassTimeTableComponent } from './aded/addclstmt.comp';
import { ViewClassTimeTableComponent } from './view/viewclstmt.comp';

import { ClassTimeTableService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, ScheduleModule, DialogModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewClassTimeTableComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clssch", "rights": "view", "urlname": "/classtimetable" }
      },
      {
        path: 'add', component: AddClassTimeTableComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clssch", "rights": "add", "urlname": "/add" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    ViewClassTimeTableComponent,
    AddClassTimeTableComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, ScheduleModule, DialogModule
  ],

  providers: [AuthGuard, ClassTimeTableService]
})

export class ClassTimeTableModule {
  public static routes = routes;
}
