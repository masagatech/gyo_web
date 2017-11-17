import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddLeaveComponent } from './aded/addlv.comp';
import { ViewLeaveComponent } from './view/viewlv.comp';
import { PendingLeaveComponent } from './pending/pendlv.comp';
import { ApprovalLeaveComponent } from './approval/apprlv.comp';

import { LeaveService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "psngrlv", "rights": "view", "urlname": "/Leave" }
      },
      {
        path: 'add', component: AddLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "psngrlv", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "psngrlv", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'pending', component: PendingLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "lvpsngrappr", "rights": "view", "urlname": "/pending" }
      },
      {
        path: 'approval/:psngrid', component: ApprovalLeaveComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "lvpsngrappr", "rights": "view", "urlname": "/approval" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    AddLeaveComponent,
    ViewLeaveComponent,
    PendingLeaveComponent,
    ApprovalLeaveComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, LeaveService]
})

export class LeaveModule {
  public static routes = routes;
}
