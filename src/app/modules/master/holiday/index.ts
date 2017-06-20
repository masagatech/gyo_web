import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddHolidayComponent } from './aded/addhld.comp';
import { ViewHolidayComponent } from './view/viewhld.comp';

import { HolidayService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewHolidayComponent },
      { path: 'add', component: AddHolidayComponent },
      { path: 'details/:id', component: AddHolidayComponent },
      { path: 'edit/:id', component: AddHolidayComponent }
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

  providers: [HolidayService]
})

export class HolidayModule {
  public static routes = routes;
}
