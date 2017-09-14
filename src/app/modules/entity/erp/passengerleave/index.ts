import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddPassengerLeaveComponent } from './aded/addpsngrlv.comp';
import { ViewPassengerLeaveComponent } from './view/viewpsngrlv.comp';
import { PendingPassengerLeaveComponent } from './pending/pendpsngrlv.comp';
import { ApprovalPassengerLeaveComponent } from './approval/apprpsngrlv.comp';

import { PassengerLeaveService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewPassengerLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "lvpsngr", "rights": "view", "urlname": "/PassengerLeave" }
      },
      {
        path: 'add', component: AddPassengerLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "lvpsngr", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddPassengerLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "lvpsngr", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'pending', component: PendingPassengerLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "psngrlvappr", "rights": "view", "urlname": "/pending" }
      },
      {
        path: 'approval/:psngrid', component: ApprovalPassengerLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "psngrlvappr", "rights": "view", "urlname": "/approval" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AddPassengerLeaveComponent,
    ViewPassengerLeaveComponent,
    PendingPassengerLeaveComponent,
    ApprovalPassengerLeaveComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, PassengerLeaveService]
})

export class PassengerLeaveModule {
  public static routes = routes;
}
