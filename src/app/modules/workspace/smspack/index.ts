import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard } from '@services';

import { AddSMSPackComponent } from './aded/addsp.comp';
import { ViewSMSPackComponent } from './view/viewsp.comp';

import { SMSPackService } from '@services/master';
import { CommonService } from '@services';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewSMSPackComponent, canActivate: [AuthGuard], data: { "module": "pws", "submodule": "smspack", "rights": "view", "urlname": "/smspack" } },
      { path: 'add', component: AddSMSPackComponent, canActivate: [AuthGuard], data: { "module": "pws", "submodule": "smspack", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddSMSPackComponent, canActivate: [AuthGuard], data: { "module": "pws", "submodule": "smspack", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddSMSPackComponent, canActivate: [AuthGuard], data: { "module": "pws", "submodule": "smspack", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddSMSPackComponent,
    ViewSMSPackComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, SMSPackService, CommonService]
})

export class SMSPackModule {
  public static routes = routes;
}
