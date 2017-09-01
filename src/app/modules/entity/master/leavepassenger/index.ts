import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddLeavePassengerComponent } from './aded/addlvpsngr.comp';
import { ViewLeavePassengerComponent } from './view/viewlvpsngr.comp';

import { LeavePassengerService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewLeavePassengerComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "lvpsngr", "rights": "view", "urlname": "/leavepassenger" } },
      { path: 'add', component: AddLeavePassengerComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "lvpsngr", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddLeavePassengerComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "lvpsngr", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddLeavePassengerComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "lvpsngr", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddLeavePassengerComponent,
    ViewLeavePassengerComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, LeavePassengerService]
})

export class LeavePassengerModule {
  public static routes = routes;
}
