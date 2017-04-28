import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddHolidayComponent } from './aded/addholiday.comp';
import { ViewHolidayComponent } from './view/viewholiday.comp';

import { HolidayService } from '../../_services/holiday/holiday-service';

import { LazyLoadEvent, DataTableModule, ScheduleModule, AutoCompleteModule, SelectButtonModule } from 'primeng/primeng';

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
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, ScheduleModule, AutoCompleteModule, SelectButtonModule
  ],

  providers: [HolidayService]
})

export class HolidayModule {
  public static routes = routes;
}
