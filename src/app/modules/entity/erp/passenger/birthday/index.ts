import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { BirthdayComponent } from './birthday.comp';

import { PassengerService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: BirthdayComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "dob", "rights": "view", "urlname": "/birthday" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    BirthdayComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, PassengerService]
})

export class BirthdayModule {
  public static routes = routes;
}
