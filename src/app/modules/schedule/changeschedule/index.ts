import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChangeScheduleComponent } from './viewpd.comp';
import { PickDropService, EntityService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, OrderListModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ChangeScheduleComponent }
    ]
  },
];

@NgModule({
  declarations: [
    ChangeScheduleComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, OrderListModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [PickDropService, EntityService]
})

export class ChangeScheduleModule {
  public static routes = routes;
}
