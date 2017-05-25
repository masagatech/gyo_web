import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../_shared/sharedcomp.module';
import { SocketIoModule, SocketIoConfig } from 'ng2-socket-io';
import { TripTrackingComponent } from './ttmap.comp';
import { TTMapService } from '../../_services/triptracking/ttmap-service';
import { Globals } from '../../_const/globals';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, GMapModule, SelectButtonModule } from 'primeng/primeng';

export const config: SocketIoConfig = {
  url: Globals.socketurl, options: {}
};

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
    CommonModule, FormsModule, SharedComponentModule, SocketIoModule.forRoot(config),
    RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, GMapModule, SelectButtonModule
  ],

  providers: [TTMapService]
})

export class TripTrackingModule {
  

  constructor() {

  }

  public static routes = routes;
}
