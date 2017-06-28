import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { AddHolidayComponent } from './aded/addhld.comp';
import { ViewHolidayComponent } from './view/viewhld.comp';

import { HolidayService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewHolidayComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "hld", "rights": "view", "urlname": "/holiday" } },
      { path: 'add', component: AddHolidayComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "hld", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddHolidayComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "hld", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddHolidayComponent, canActivate: [AuthGuard], data: { "module": "pentt", "submodule": "hld", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];

@NgModule({
  declarations: [
    AddHolidayComponent,
    ViewHolidayComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, HolidayService]
})

export class HolidayModule {
  public static routes = routes;
}
