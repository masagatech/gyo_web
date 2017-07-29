import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../_shared/sharedcomp.module';
import { SocketIoModule, SocketIoConfig } from 'ng2-socket-io';
import { AuthGuard } from '../../_services/authguard-service';

import { TripTrackingComponent } from './ttmap.comp';
import { TTMapService } from '@services/master';
import { Globals } from '@models';
import { TimeAgoPipe } from '@pipe/timeago'
//child components
import { ADHOST } from '@directives';

import { PSGComponent } from './passengers/psg.comp'
import { INFOComponent } from './info/info.comp'
import { HISTORYComponent } from './history/history.comp'



import { LazyLoadEvent, DataTableModule, AutoCompleteModule, GMapModule, SelectButtonModule,CalendarModule } from 'primeng/primeng';

export const config: SocketIoConfig = {
  url: Globals.socketurl, options: {}
};

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TripTrackingComponent, canActivate: [AuthGuard],
        data: { "module": "", "submodule": "tt", "rights": "view", "urlname": "/triptracking" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TripTrackingComponent,
    TimeAgoPipe,
    PSGComponent,
    INFOComponent,
    ADHOST,
    HISTORYComponent
  ],
  entryComponents: [PSGComponent, INFOComponent,HISTORYComponent],
  imports: [
    CommonModule, FormsModule, SharedComponentModule, SocketIoModule.forRoot(config),
    RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, GMapModule, SelectButtonModule,
    CalendarModule
  ],

  providers: [AuthGuard, TTMapService]
})

export class TripTrackingModule {
  constructor() {

  }

  public static routes = routes;
}
