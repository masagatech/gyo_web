import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TripTrackingComponent } from './ttmap.comp';
import { TTMapService } from '../../_services/triptracking/ttmap-service';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, GMapModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: TripTrackingComponent }
    ]
  },
];

@NgModule({
  declarations: [
    TripTrackingComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, GMapModule
  ],

  providers: [TTMapService]
})

export class TripTrackingModule {
  public static routes = routes;
}
