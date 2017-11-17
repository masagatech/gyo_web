import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AttendanceComponent } from './attendance.comp';

import { AttendanceService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AttendanceComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "psngrattnd", "rights": "view", "urlname": "/attendance" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AttendanceComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataTableModule, AutoCompleteModule
  ],
  
    providers: [AuthGuard, AttendanceService]
})

export class AttendanceModule {
  public static routes = routes;
}
