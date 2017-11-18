import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { PassengerBirthdayComponent } from './rptpsngrbirth.comp';
import { PassengerService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: PassengerBirthdayComponent, canActivate: [AuthGuard],
        data: { "module": "rptpsngr", "submodule": "rptpsngrdob", "rights": "view", "urlname": "/birthday" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    PassengerBirthdayComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, PassengerService]
})

export class PassengerBirthdayReportsModule {
  public static routes = routes;
}
