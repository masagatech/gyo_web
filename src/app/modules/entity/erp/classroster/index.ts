import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddClassRosterComponent } from './aded/addcr.comp';
import { ViewClassRosterComponent } from './view/viewcr.comp';

import { ClassRosterService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, ScheduleModule, DialogModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewClassRosterComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clsrst", "rights": "view", "urlname": "/classroster" }
      },
      {
        path: 'add', component: AddClassRosterComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "clsrst", "rights": "add", "urlname": "/add" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AddClassRosterComponent,
    ViewClassRosterComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, ScheduleModule, DialogModule
  ],

  providers: [AuthGuard, ClassRosterService]
})

export class ClassRosterModule {
  public static routes = routes;
}
