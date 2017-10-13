import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { PassengerBirthdayComponent } from './psngrbirth.comp';

import { PassengerService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: PassengerBirthdayComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "dob", "rights": "view", "urlname": "/birthday" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    PassengerBirthdayComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, PassengerService]
})

export class PassengerBirthdayModule {
  public static routes = routes;
}
