import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { CreateScheduleComponent } from './addpd.comp';
import { PickDropService, EntityService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, OrderListModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: CreateScheduleComponent, canActivate: [AuthGuard],
        data: { "module": "schd", "submodule": "asch", "rights": "add", "urlname": "/createschedule" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    CreateScheduleComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, OrderListModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, PickDropService, EntityService]
})

export class CreateScheduleModule {
  public static routes = routes;
}