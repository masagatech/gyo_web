import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

import { EditScheduleComponent } from './editschd.comp';
import { PickDropService, EntityService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, OrderListModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: EditScheduleComponent, canActivate: [AuthGuard],
        data: { "module": "schd", "submodule": "esch", "rights": "edit", "urlname": "/changeschedule" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    EditScheduleComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, OrderListModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [AuthGuard, PickDropService, EntityService]
})

export class EditScheduleModule {
  public static routes = routes;
}
